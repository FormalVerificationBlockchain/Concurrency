The file "replicated_Safe_Remote_Purchase_Model.csp" is the replcated model of the Safe Remote Purchase smart contract which generates false attacks.

The correct model of the Safe Remote Purchase has two parts: the business logic modelled in the file "correct_safe_remote_purchase.csp" and the generated framework - the control logic in the file "blockchain_framework_Safe_Remote_Purchase.csp". This model does not show false attacks. 

The counter smart contract is used to demonstrate that the proposed approach is able to detect concurrency problems. The model of this smart contract also contains two parts: the mannually modelled smart contract in "counter_smart_contract.csp" and the generated framework in the file "blockchain_framework_counter_smart_contract.csp"
