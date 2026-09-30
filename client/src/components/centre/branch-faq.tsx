import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function BranchFaq({ faqs }: { faqs: readonly { question: string; answer: string }[] }) {
  return (
    <Accordion type="single" collapsible className="space-y-2">
      {faqs.map((faq, index) => (
        <AccordionItem key={faq.question} value={`faq-${index}`} className="bg-background border rounded-lg px-4">
          <AccordionTrigger className="text-left hover:no-underline py-4">
            <span className="font-semibold text-base pr-4">{faq.question}</span>
          </AccordionTrigger>
          <AccordionContent forceMount className="text-base text-slate-700 pb-4">{faq.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}