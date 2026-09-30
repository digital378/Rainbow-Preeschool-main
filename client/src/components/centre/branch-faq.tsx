import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Link } from "wouter";
import { branchFaqAnswerSegments } from "@shared/centre-data";

export function BranchFaq({ faqs }: { faqs: readonly { question: string; answer: string; link?: { text: string; href: string } }[] }) {
  return (
    <Accordion type="single" collapsible className="space-y-2">
      {faqs.map((faq, index) => (
        <AccordionItem key={faq.question} value={`faq-${index}`} className="bg-background border rounded-lg px-4">
          <AccordionTrigger className="text-left hover:no-underline py-4">
            <span className="font-semibold text-base pr-4">{faq.question}</span>
          </AccordionTrigger>
          <AccordionContent forceMount className="text-base text-slate-700 pb-4">
            {branchFaqAnswerSegments(faq).map((segment, i) => segment.href
              ? <Link key={i} href={segment.href} className="text-primary underline underline-offset-2">{segment.text}</Link>
              : <span key={i}>{segment.text}</span>)}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}