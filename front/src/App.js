import React, { useState } from "react";
import { ethers } from "ethers";
import InvoiceNFT from "./InvoiceNFT.json"; // ABI du contrat

const contractAddress = "0xacDf9813056B52A2A0035e1a79d470d08A20Bad5"; // Remplacez par l'adresse déployée

function App() {
  const [invoiceId, setInvoiceId] = useState("");
  const [details, setDetails] = useState(null);

  const createInvoice = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        InvoiceNFT.abi,
        signer
      );

      const issuer = "Nom du vendeur";
      const recipient = "Nom du client";
      const description = "Description des services";
      const amount = ethers.parseUnits("100", "ether"); // Exemple montant en ETH
      const currency = "ETH";
      const dueDate = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60; // Échéance à 30 jours
      const paymentInfo = "Coordonnées bancaires ou autre";

      const tx = await contract.createInvoice(
        issuer,
        recipient,
        description,
        amount,
        currency,
        dueDate,
        paymentInfo
      );
      await tx.wait();
      console.log("Facture créée :", tx);
    } catch (error) {
      console.error("Erreur lors de la création de la facture:", error);
    }
  };

  const getInvoiceDetails = async (id) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(
        contractAddress,
        InvoiceNFT.abi,
        provider
      );

      const invoice = await contract.getInvoiceDetails(id);
      setDetails(invoice);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des détails de la facture:",
        error
      );
    }
  };

  return (
    <div>
      <h1>Gestion des Factures NFT</h1>
      <button onClick={createInvoice}>Créer une Facture</button>
      <div>
        <h2>Rechercher une facture</h2>
        <input
          type="text"
          value={invoiceId}
          onChange={(e) => setInvoiceId(e.target.value)}
        />
        <button onClick={() => getInvoiceDetails(invoiceId)}>Rechercher</button>
        {details && (
          <div>
            <p>ID: {details.id.toString()}</p>
            <p>Émetteur: {details.issuer}</p>
            <p>Client: {details.recipient}</p>
            <p>Description: {details.description}</p>
            <p>Montant: {ethers.formatUnits(details.amount, "ether")} ETH</p>
            <p>Status: {details.status}</p>
            <p>
              Date d'échéance:{" "}
              {new Date(Number(details.dueDate) * 1000).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
