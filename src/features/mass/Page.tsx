import React from 'react';
import FeaturePlaceholder from '@features/home/components/FeaturePlaceholder';

interface PageProps {
  language: 'es' | 'la';
}

const Page: React.FC<PageProps> = ({ language }) => {
  return <FeaturePlaceholder title="Santa Misa" language={language} />;
};

export default Page;
