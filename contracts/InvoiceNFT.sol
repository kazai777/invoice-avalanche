// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract InvoiceNFT is ERC1155, Ownable {
    uint256 public currentInvoiceId = 1;

    struct Invoice {
        uint256 id;
        string issuer;
        string recipient;
        string description;
        uint256 amount;
        string currency;
        string status;
        uint256 dueDate;
        string paymentInfo;
        uint256 issueDate;
    }

    mapping(uint256 => Invoice) public invoices;
    mapping(uint256 => address) public invoiceCreators;

    event InvoiceCreated(uint256 indexed invoiceId, address indexed creator, uint256 nftId);
    event InvoicePaid(uint256 indexed invoiceId, address indexed creator);

    constructor() 
        ERC1155("https://api.example.com/metadata/{id}.json") 
        Ownable(msg.sender)
    {}

    function createInvoice(
        string memory _issuer,
        string memory _recipient,
        string memory _description,
        uint256 _amount,
        string memory _currency,
        uint256 _dueDate,
        string memory _paymentInfo
    ) public {
        uint256 invoiceId = currentInvoiceId;
        invoices[invoiceId] = Invoice({
            id: invoiceId,
            issuer: _issuer,
            recipient: _recipient,
            description: _description,
            amount: _amount,
            currency: _currency,
            status: "emis et non paye",
            dueDate: _dueDate,
            paymentInfo: _paymentInfo,
            issueDate: block.timestamp
        });

        invoiceCreators[invoiceId] = msg.sender;
        _mint(msg.sender, invoiceId, 2, "");
        currentInvoiceId++;

        emit InvoiceCreated(invoiceId, msg.sender, invoiceId);
    }

    function markAsPaid(uint256 _invoiceId) public {
        require(msg.sender == invoiceCreators[_invoiceId], "Seul le createur de la facture peut la marquer comme payee");
        Invoice storage invoice = invoices[_invoiceId];
        require(keccak256(bytes(invoice.status)) != keccak256(bytes("paye")), "La facture est deja payee.");
        invoice.status = "paye";
        emit InvoicePaid(_invoiceId, msg.sender);
    }

    function mintMoreCopies(uint256 _invoiceId, uint256 _amount) public {
        require(msg.sender == invoiceCreators[_invoiceId], "Seul le createur de la facture peut minter plus de copies");
        _mint(msg.sender, _invoiceId, _amount, "");
    }

    function getInvoiceDetails(uint256 _invoiceId) public view returns (Invoice memory) {
        return invoices[_invoiceId];
    }
}
