import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQ {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  faqs: FAQ[];
  locality: string;
}

export function FAQAccordion({ faqs, locality }: FAQAccordionProps) {
  return (
    <section className="py-16 md:py-20">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-10" data-reveal="float">
          <h2 className="text-2xl md:text-3xl font-bold mb-3" data-sparkle>Frequently Asked Questions</h2>
          <p className="text-muted-foreground">
            Common questions about playgroup in {locality}
          </p>
        </div>

        <div data-reveal="float">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`faq-${index}`}
                data-testid={`faq-item-${index}`}
              >
                <AccordionTrigger
                  className="text-left text-base font-medium hover:no-underline"
                  data-testid={`faq-trigger-${index}`}
                >
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent
                  className="text-muted-foreground"
                  data-testid={`faq-content-${index}`}
                >
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
