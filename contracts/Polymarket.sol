// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

contract Polymarket {
    address public owner;

    uint256 public constant DECIMAL_PRECISION = 10**8; // 8 decimal places
    uint256 public totalQuestions = 0;

    constructor() {
        owner = msg.sender;
    }

    mapping(uint256 => Questions) public questions;

    struct Questions {
        uint256 id;
        string question;
        uint256 timestamp;
        uint256 endTimestamp;
        address createdBy;
        string creatorImageHash;
        AmountAdded[] yesCount;
        AmountAdded[] noCount;
        uint256 totalAmount;        // Now a fixed-point decimal
        uint256 totalYesAmount;     // Now a fixed-point decimal
        uint256 totalNoAmount;      // Now a fixed-point decimal
        bool eventCompleted;
        string description;
        string resolverUrl;
    }

    struct AmountAdded {
        address user;
        uint256 amount;  // Now a fixed-point decimal
        uint256 timestamp;
    }

    mapping(address => uint256) public winningAmount;
    address[] public winningAddresses;

    event QuestionCreated(
        uint256 id,
        string question,
        uint256 timestamp,
        address createdBy,
        string creatorImageHash,
        uint256 totalAmount,
        uint256 totalYesAmount,
        uint256 totalNoAmount
    );

    // Helper function to convert to fixed-point
    function toFixedPoint(uint256 value) internal pure returns (uint256) {
        return value * DECIMAL_PRECISION;
    }

    // Helper function to convert from fixed-point
    function fromFixedPoint(uint256 value) internal pure returns (uint256) {
        return value / DECIMAL_PRECISION;
    }

    // Helper function for fixed-point multiplication
    function mulFixedPoint(uint256 a, uint256 b) internal pure returns (uint256) {
        return (a * b) / DECIMAL_PRECISION;
    }

    // Helper function for fixed-point division
    function divFixedPoint(uint256 a, uint256 b) internal pure returns (uint256) {
        return (a * DECIMAL_PRECISION) / b;
    }

    function createQuestion(
        string memory _question,
        string memory _creatorImageHash,
        string memory _description,
        string memory _resolverUrl,
        uint256 _endTimestamp
    ) public {
        require(msg.sender == owner, "Unauthorized");

        uint256 timestamp = block.timestamp;

        Questions storage question = questions[totalQuestions];

        question.id = totalQuestions++;
        question.question = _question;
        question.timestamp = timestamp;
        question.createdBy = msg.sender;
        question.creatorImageHash = _creatorImageHash;
        question.totalAmount = 0;
        question.totalYesAmount = 0;
        question.totalNoAmount = 0;
        question.description = _description;
        question.resolverUrl = _resolverUrl;
        question.endTimestamp = _endTimestamp;

        emit QuestionCreated(
            totalQuestions,
            _question,
            timestamp,
            msg.sender,
            _creatorImageHash,
            0,
            0,
            0
        );
    }

    function addYesBet(uint256 _questionId) public payable {
        require(_questionId < totalQuestions, "Invalid question ID");
        require(msg.value > 0, "Bet amount must be greater than 0");

        Questions storage question = questions[_questionId];
        AmountAdded memory amountAdded = AmountAdded(
            msg.sender,
            toFixedPoint(msg.value),
            block.timestamp
        );

        question.totalYesAmount += toFixedPoint(msg.value);
        question.totalAmount += toFixedPoint(msg.value);
        question.yesCount.push(amountAdded);
    }

    function addNoBet(uint256 _questionId) public payable {
        require(_questionId < totalQuestions, "Invalid question ID");
        require(msg.value > 0, "Bet amount must be greater than 0");

        Questions storage question = questions[_questionId];
        AmountAdded memory amountAdded = AmountAdded(
            msg.sender,
            toFixedPoint(msg.value),
            block.timestamp
        );

        question.totalNoAmount += toFixedPoint(msg.value);
        question.totalAmount += toFixedPoint(msg.value);
        question.noCount.push(amountAdded);
    }

    function getGraphData(uint256 _questionId)
        public
        view
        returns (AmountAdded[] memory, AmountAdded[] memory)
    {
        Questions storage question = questions[_questionId];
        return (question.yesCount, question.noCount);
    }

    function distributeWinningAmount(uint256 _questionId, bool eventOutcome)
        public
        payable
    {
        require(msg.sender == owner, "Unauthorized");

        Questions storage question = questions[_questionId];
        require(!question.eventCompleted, "Event already completed");

        if (eventOutcome) {
            // Yes outcome wins
            for (uint256 i = 0; i < question.yesCount.length; i++) {
                // Calculate winnings using fixed-point arithmetic
                uint256 amount = mulFixedPoint(
                    question.totalNoAmount,
                    divFixedPoint(question.yesCount[i].amount, question.totalYesAmount)
                );
                
                uint256 totalWinnings = amount + question.yesCount[i].amount;
                winningAmount[question.yesCount[i].user] += totalWinnings;
                winningAddresses.push(question.yesCount[i].user);
            }

            // Distribute winnings
            for (uint256 i = 0; i < winningAddresses.length; i++) {
                address payable recipient = payable(winningAddresses[i]);
                uint256 winnings = fromFixedPoint(winningAmount[recipient]);
                (bool success, ) = recipient.call{value: winnings}("");
                require(success, "Transfer failed");
                delete winningAmount[recipient];
            }
            delete winningAddresses;
        } else {
            // No outcome wins
            for (uint256 i = 0; i < question.noCount.length; i++) {
                // Calculate winnings using fixed-point arithmetic
                uint256 amount = mulFixedPoint(
                    question.totalYesAmount,
                    divFixedPoint(question.noCount[i].amount, question.totalNoAmount)
                );
                
                uint256 totalWinnings = amount + question.noCount[i].amount;
                winningAmount[question.noCount[i].user] += totalWinnings;
                winningAddresses.push(question.noCount[i].user);
            }

            // Distribute winnings
            for (uint256 i = 0; i < winningAddresses.length; i++) {
                address payable recipient = payable(winningAddresses[i]);
                uint256 winnings = fromFixedPoint(winningAmount[recipient]);
                (bool success, ) = recipient.call{value: winnings}("");
                require(success, "Transfer failed");
                delete winningAmount[recipient];
            }
            delete winningAddresses;
        }
        question.eventCompleted = true;
    }

    function isAdmin() public view returns (bool) {
        return msg.sender == owner;
    }

    // Allow contract to receive ETH
    receive() external payable {}
}