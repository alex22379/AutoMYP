type SectionProps = {
  title: string;
  children: React.ReactNode;
};

const Section: React.FC<SectionProps> = ({ title, children }) => {
  return (
    <section className="space-y-4">
      <h2 className="text-power font-mono text-2xl font-bold uppercase">
        {title}
      </h2>
      {children}
    </section>
  );
};

export default Section;
