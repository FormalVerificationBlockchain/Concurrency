const fs = require("fs");

fs.readFile("input.json", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  try {
    const capitalize = (string) => string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    const jsonData = JSON.parse(data);
    const outputString = 
        "#define N " + jsonData.n + ";\n" + 
        "#define INITIAL_BALANCE " + jsonData.initialBalance + ";\n" + 
        "#define EXIT_CODE_SUCCESS 0;\n" + 
        "#define EXIT_CODE_ERROR 1;\n\n" + 
        "var balances = [0, " + (new Array(jsonData.n - 1).fill("INITIAL_BALANCE")).join(", ") + "];\n" + 
        "hvar counter = 0;\n\n" + 
        jsonData.functionNames.map((functionName) => 
            "channel " + functionName + "_invocation 0;\n" + 
            "channel " + functionName + " 0;\n"
        ).join('') + 
        "channel release 0;\n\n" + 
        jsonData.functionNames.map((functionName) => 
            functionName.split('_').map(capitalize).join('') + "Executor() = \n" + 
            "   " + functionName + "_invocation?msg_sender.msg_value -> \n" + 
            "   " + functionName + "!msg_sender.msg_value -> \n" + 
            "   release?exit_code -> \n" + 
            "   Skip;\n"
        ).join('\n') + '\n' + 
        "ExecutionClient(i) = \n" + 
        "   (start_execution_client.i -> Skip);\n" + 
        "   (" + jsonData.functionNames.map((functionName) => functionName.split('_').map(capitalize).join('') + "Executor()").join(" [] ") + ");\n" + 
        "   (end_execution_client.i -> Skip);\n" + 
        "   ExecutionClient(i);\n\n" + 
        "ConsensusClient(i) = \n" + 
        "   [counter == i]\n" + 
        "   start_execution_client.i -> \n" + 
        "   end_execution_client.i -> \n" + 
        "   tau{counter = (counter + 1) % N} -> \n" + 
        "   ConsensusClient(i);\n\n" + 
        "BlockchainNode(i) = ExecutionClient(i) || ConsensusClient(i);\n\n" + 
        "BlockchainNetwork() = BlockchainNode(0) || BlockchainNode(1) || BlockchainNode(2);\n\n\n" + 
        "#define non_constant_balances (" + Array.from(Array(jsonData.n).keys()).map((index) => "balances[" + index + "]").join(' + ') + " != 0 + " + (new Array(jsonData.n - 1).fill("INITIAL_BALANCE")).join(" + ") + ");\n";
    fs.writeFile("./blockchain_framework.csp", outputString, (err) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log("The blockchain framework to be included in your CSP model has been successfully generated under the same directory of this generator script.");
    });
  } catch (parseError) {
    console.error(parseError);
  }
});