
import { ExternalLink } from 'lucide-react';
import { Box, Text, Flex, Link } from '@heroui/react';

interface Source {
  id: string;
  name: string;
  snippet: string;
  link: string;
}

interface ChatSourceReferenceProps {
  source: Source;
}

const ChatSourceReference = ({ source }: ChatSourceReferenceProps) => {
  return (
    <Box 
      p={3} 
      bg="secondary/20" 
      borderRadius="md" 
      borderLeft="2px solid" 
      borderColor="primary/50"
      className="hero-card"
    >
      <Flex alignItems="center" justifyContent="space-between" mb={1}>
        <Text fontWeight="medium" fontSize="sm">{source.name}</Text>
        <Link 
          href={source.link} 
          target="_blank"
          rel="noopener noreferrer"
          display="flex"
          alignItems="center"
          fontSize="xs"
          color="primary"
          _hover={{ textDecoration: 'underline' }}
        >
          <Text mr={1}>Fonte</Text>
          <ExternalLink size={12} />
        </Link>
      </Flex>
      <Text fontSize="xs" color="white/70" lineHeight="relaxed">
        {source.snippet}
      </Text>
    </Box>
  );
};

export default ChatSourceReference;
