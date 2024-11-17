import { Universal, Node } from '@aeternity/aepp-sdk';

const aeternityClient = async () => {
  const node = await Node({ url: 'https://testnet.aeternity.io' }); // Mainnet URL
  return Universal({
    nodes: [{ name: 'mainnet', instance: node }],
    compilerUrl: 'https://compiler.aepps.com', // Compiler URL
  });
};

export default aeternityClient;
