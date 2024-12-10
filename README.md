---

# **StudyDAO**

This project comprises two smart contracts deployed on the **Sepolia Ethereum Testnet** using the **Hardhat framework**. These contracts form the backbone of a decentralized ecosystem for **collaborative learning, resource sharing, and incentivized participation**.

---

## **Contract Details**

### **StudyDAO Contract**
- **Contract Address**: [0x828BcC0895Be26F23296A97C79890046e3020A90](https://sepolia.etherscan.io/address/0x828BcC0895Be26F23296A97C79890046e3020A90)
- **Purpose**: This contract governs the DAO (Decentralized Autonomous Organization) functionality, enabling:
  - Proposal submissions for project funding.
  - Approval and rejection of proposals by DAO members.
  - Fund disbursement and STD token (StudyDAO Token) distribution to project contributors.
  - Governance through decentralized voting mechanisms.

### **KnowledgeVault Contract**
- **Contract Address**: [0xb19e7037aA19b7aF11D4fD11b85F96018F2366dA](https://sepolia.etherscan.io/address/0xb19e7037aA19b7aF11D4fD11b85F96018F2366dA)
- **Purpose**: This contract facilitates:
  - Uploading of educational resources.
  - Tagging and categorization of resources for easy discoverability.
  - Voting on resources (upvotes/downvotes) to determine quality.
  - Reward distribution in STD tokens to resource creators based on popularity.

---

## **Project Overview**

The **StudyDAO and KnowledgeVault** system creates a decentralized platform where **students**, **teachers**, and **contributors** collaborate to enhance education and knowledge-sharing. By leveraging blockchain technology, this platform ensures **transparency**, **fair rewards**, and **community-driven governance**.

### **Key Features**
1. **User Roles**:
   - **Teachers**: Share resources, organize events, and mentor students.
   - **Students**: Propose projects, share knowledge, and participate in events.

2. **Proposal Submission**:
   - Students submit proposals for funding educational projects.
   - Approved proposals are made available for community funding.

3. **Funding Mechanism**:
   - Community members contribute funds to approved projects.
   - Contributors receive STD tokens in proportion to their donation.

4. **Resource Sharing**:
   - Users upload educational content such as documents, videos, and guides.
   - Resources are categorized using **knowledge tags** (e.g., Math, Science, History).

5. **Voting and Rewards**:
   - Resources can be voted on by the community.
   - Resource creators earn STD tokens based on the number of upvotes.

6. **Token Utility**:
   - STD tokens can be used to book **knowledge-sharing events** or access premium features on the platform.

7. **Event Booking**:
   - Users utilize STD tokens to participate in learning events or workshops organized by teachers or mentors.

---

## **Technical Details**

### **Smart Contracts**
1. **StudyDAO Contract**:
   - Manages proposals, project funding, and STD token distribution.
   - Enforces DAO voting for project approval or rejection.

2. **KnowledgeVault Contract**:
   - Handles resource uploads with metadata (tags, creator, etc.).
   - Implements upvote/downvote mechanisms.
   - Automates reward distribution to content creators.

### **Blockchain Network**
- **Testnet**: Sepolia Ethereum Testnet
- **Framework**: Hardhat
- **Token Standard**: ERC-20 (for STD tokens)

---

## **Frontend Implementation**

The frontend is built using **Vite React** to provide an interactive and intuitive user experience.

### **How to Run the Frontend**
1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd client
   ```
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Start the Development Server**:
   ```bash
   npm run dev
   ```
4. **Access the App**:
   Open your browser and navigate to `http://localhost:5173` to explore the platform.

---

## **Deployment Links**

### StudyDAO Contract
- **Etherscan Address**: [0x828BcC0895Be26F23296A97C79890046e3020A90](https://sepolia.etherscan.io/address/0x828BcC0895Be26F23296A97C79890046e3020A90)

### KnowledgeVault Contract
- **Etherscan Address**: [0xb19e7037aA19b7aF11D4fD11b85F96018F2366dA](https://sepolia.etherscan.io/address/0xb19e7037aA19b7aF11D4fD11b85F96018F2366dA)

---

## **Contribution Guidelines**

Contributions to enhance the **StudyDAO** ecosystem are highly encouraged. Whether you're interested in:
- Adding new features
- Improving smart contract efficiency
- Enhancing the frontend experience
- Proposing new use cases

Please submit a pull request or raise an issue on the repository.

---

## **License**

This project is open-source and licensed under the **MIT License**. For details, see the LICENSE file in the repository.

---

Feel free to ask if you need any additional details or assistance! 😊
