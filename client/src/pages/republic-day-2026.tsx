import { useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CTASection } from "@/components/cta-section";
import { SEO } from "@/components/seo";
import { Calendar, User, Clock, Download, MapPin, Phone, Award, ClipboardList, Images, ArrowLeft } from "lucide-react";

function RepublicDaySchema() {
  useEffect(() => {
    const articleSchema = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "Republic Day 2026 in India: History, Significance, Parade, Speeches, Essays, Quotes, Images & Wishes",
      "description": "Complete guide to Republic Day 2026 in India. Learn about 26 January history, significance, parade highlights, speeches in English & Hindi, essays for students, inspiring quotes, DP images & wishes.",
      "author": {
        "@type": "Organization",
        "name": "Rainbow Preschool International",
        "url": "https://www.rainbowpreschools.com"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Rainbow Preschool International",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.rainbowpreschools.com/images/logo.webp"
        }
      },
      "datePublished": "2026-01-20T00:00:00.000Z",
      "dateModified": "2026-01-20T00:00:00.000Z",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "https://www.rainbowpreschools.com/republic-day-2026"
      },
      "wordCount": 2100,
      "articleSection": "Republic Day",
      "keywords": "republic day 2026, 26 january 2026, republic day parade, republic day speech, republic day essay, republic day quotes, republic day wishes, republic day images, republic day dp, indian constitution day, republic day india, gantantra diwas 2026, 77th republic day"
    };

    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Why is Republic Day celebrated on 26 January?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Republic Day is celebrated on 26 January because the Constitution of India came into effect on this date in 1950. The date was chosen to commemorate the Purna Swaraj Declaration of 1930."
          }
        },
        {
          "@type": "Question",
          "name": "Where is the Republic Day parade held?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The main Republic Day parade is held at Kartavya Path (formerly Rajpath) in New Delhi, in the presence of the President of India."
          }
        },
        {
          "@type": "Question",
          "name": "Which Republic Day is celebrated in 2026?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "India will celebrate its 77th Republic Day on 26 January 2026."
          }
        },
        {
          "@type": "Question",
          "name": "Who drafted the Indian Constitution?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Dr. B. R. Ambedkar was the chief architect of the Indian Constitution. He chaired the Drafting Committee that prepared the final draft."
          }
        }
      ]
    };

    const script1 = document.createElement('script');
    script1.type = 'application/ld+json';
    script1.text = JSON.stringify(articleSchema);
    script1.id = 'republic-day-article-schema';
    document.head.appendChild(script1);

    const script2 = document.createElement('script');
    script2.type = 'application/ld+json';
    script2.text = JSON.stringify(faqSchema);
    script2.id = 'republic-day-faq-schema';
    document.head.appendChild(script2);

    return () => {
      const existingScript1 = document.getElementById('republic-day-article-schema');
      const existingScript2 = document.getElementById('republic-day-faq-schema');
      if (existingScript1) existingScript1.remove();
      if (existingScript2) existingScript2.remove();
    };
  }, []);

  return null;
}

const dpImages = [
  { src: "/images/republic-day-dp-1.png", alt: "Republic Day 2026 DP - Tricolour Profile Frame", title: "Republic Day Profile Frame" },
  { src: "/images/republic-day-dp-2.png", alt: "Saluting Spirit of India Republic Day DP", title: "Saluting India DP" },
  { src: "/images/republic-day-dp-3.png", alt: "Jai Hind Ashoka Chakra Republic Day DP", title: "Jai Hind DP" },
  { src: "/images/republic-day-dp-4.png", alt: "Proud to be Indian Republic Day DP", title: "Proud Indian DP" },
];

export default function RepublicDay2026() {
  return (
    <div className="pt-20 md:pt-24">
      <SEO
        title="Republic Day 2026 India: History, Parade, Speeches, Essays, Quotes, Images & Wishes"
        description="Complete guide to Republic Day 2026 in India. Learn about 26 January history, significance, parade highlights, speeches in English & Hindi, essays for students, inspiring quotes, DP images & wishes."
        keywords="republic day 2026, 26 january 2026, republic day parade, republic day speech, republic day essay, republic day quotes, republic day wishes, republic day images, republic day dp, indian constitution day, republic day india, gantantra diwas 2026, 77th republic day"
        canonical="https://www.rainbowpreschools.com/republic-day-2026"
        ogType="article"
        noIndex={false}
      />
      <RepublicDaySchema />

      <article className="py-12 md:py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/blog">
            <Button variant="ghost" className="mb-6" data-testid="button-back-to-blog">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </Link>

          <header className="mb-8">
            <Badge variant="secondary" className="mb-4">Republic Day 2026</Badge>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              Republic Day 2026 in India: History, Significance, Parade, Speeches, Essays, Quotes, Images & Wishes
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" />
                Rainbow Preschool Education Team
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                January 20, 2026
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                12 min read
              </span>
            </div>
          </header>

          <div className="prose prose-lg max-w-none dark:prose-invert">
            <p className="text-muted-foreground leading-relaxed">
              Republic Day is one of the most important national festivals of India, celebrated every year on 26 January with great pride, patriotism, and enthusiasm. As India prepares to celebrate its 77th Republic Day on 26 January 2026, this comprehensive guide covers everything you need to know about this historic day, including its history, significance, the grand Republic Day parade, speeches, essays, inspiring quotes, beautiful images, and heartfelt wishes.
            </p>

            <h2 className="text-2xl font-bold mt-10 mb-4 text-foreground">26 January Republic Day: Historical Background</h2>
            <p className="text-muted-foreground leading-relaxed">
              India attained independence from British rule on 15 August 1947, but it continued to follow the Government of India Act, 1935, as its constitutional framework. To establish complete self-governance, a Constitution was drafted under the leadership of Dr. B. R. Ambedkar, the Chairman of the Drafting Committee.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              The Constitution of India was adopted on 26 November 1949 and came into force on 26 January 1950. From this day onward, India became a republic, with its own elected government and head of state. This transformation marked the true beginning of India's journey as a sovereign, socialist, secular, and democratic republic.
            </p>

            <h3 className="text-xl font-semibold mt-8 mb-3 text-foreground">Why 26 January Was Chosen</h3>
            <p className="text-muted-foreground leading-relaxed">
              The date 26 January holds deep historical significance because it commemorates the Purna Swaraj Declaration of 1930, when the Indian National Congress resolved to fight for complete independence from British rule. On 26 January 1930, the tricolour flag was hoisted across India, and people took a pledge to continue their struggle for a free nation. To honour this historic day, the framers of the Constitution chose 26 January 1950 as the date to implement the Constitution.
            </p>

            <h3 className="text-xl font-semibold mt-8 mb-3 text-foreground">Key Facts About Republic Day 2026</h3>
            <ul className="list-disc pl-6 space-y-2 my-4">
              <li className="text-muted-foreground"><strong className="text-foreground">Constitution adopted:</strong> 26 November 1949</li>
              <li className="text-muted-foreground"><strong className="text-foreground">Constitution implemented:</strong> 26 January 1950</li>
              <li className="text-muted-foreground"><strong className="text-foreground">First President of India:</strong> Dr. Rajendra Prasad</li>
              <li className="text-muted-foreground"><strong className="text-foreground">Chief architect of the Constitution:</strong> Dr. B. R. Ambedkar</li>
              <li className="text-muted-foreground"><strong className="text-foreground">Republic Day 2026:</strong> India's 77th Republic Day</li>
            </ul>

            <h2 className="text-2xl font-bold mt-10 mb-4 text-foreground">Importance and Significance of Republic Day</h2>
            <p className="text-muted-foreground leading-relaxed">
              Republic Day symbolises the true essence of democracy and constitutional governance in India. It reminds citizens that the power of the nation lies in the hands of the people. The Constitution of India is not just a legal document; it is the foundation of our rights, duties, and the democratic framework that governs our lives.
            </p>

            <h3 className="text-xl font-semibold mt-8 mb-3 text-foreground">Why Republic Day Is Important</h3>
            <ul className="list-disc pl-6 space-y-2 my-4">
              <li className="text-muted-foreground"><strong className="text-foreground">Celebrates the rule of law:</strong> The Constitution establishes that all citizens, regardless of their background, are equal before the law.</li>
              <li className="text-muted-foreground"><strong className="text-foreground">Upholds democratic values:</strong> Republic Day reinforces India's commitment to democracy, where people have the power to choose their leaders.</li>
              <li className="text-muted-foreground"><strong className="text-foreground">Ensures fundamental rights:</strong> The Constitution guarantees every citizen fundamental rights including equality, freedom, and the right against exploitation.</li>
              <li className="text-muted-foreground"><strong className="text-foreground">Reinforces citizens' duties:</strong> Along with rights, the Constitution also outlines fundamental duties that every citizen should follow.</li>
              <li className="text-muted-foreground"><strong className="text-foreground">Promotes unity in diversity:</strong> Republic Day celebrations showcase India's rich cultural diversity and the unity that binds the nation together.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed">
              Unlike Independence Day, which celebrates freedom from colonial rule, Republic Day celebrates India's self-governance and constitutional supremacy. It is a day to reflect on our journey as a nation and recommit ourselves to the values enshrined in our Constitution.
            </p>

            <h2 className="text-2xl font-bold mt-10 mb-4 text-foreground">Republic Day Parade 2026: Pride of the Nation</h2>
            <p className="text-muted-foreground leading-relaxed">
              The Republic Day parade is one of the most searched topics during the January season and is undoubtedly the highlight of the celebrations. The grand parade is held annually at Kartavya Path (formerly known as Rajpath) in New Delhi, in the presence of the President of India, who is the supreme commander of the Indian Armed Forces.
            </p>

            <h3 className="text-xl font-semibold mt-8 mb-3 text-foreground">Highlights of the Republic Day Parade 2026</h3>
            <ul className="list-disc pl-6 space-y-2 my-4">
              <li className="text-muted-foreground"><strong className="text-foreground">Marching contingents:</strong> Disciplined marching contingents of the Indian Army, Navy, and Air Force showcase India's military strength and preparedness.</li>
              <li className="text-muted-foreground"><strong className="text-foreground">State tableaux:</strong> Beautiful tableaux from different states showcase India's incredible cultural diversity, traditions, and developmental achievements.</li>
              <li className="text-muted-foreground"><strong className="text-foreground">Cultural performances:</strong> School children from across India perform mesmerising dance and music presentations.</li>
              <li className="text-muted-foreground"><strong className="text-foreground">Daredevil motorcycle stunts:</strong> The Border Security Force (BSF) performs breathtaking motorcycle stunts that captivate audiences.</li>
              <li className="text-muted-foreground"><strong className="text-foreground">Indian Air Force fly-past:</strong> The parade concludes with a spectacular fly-past by Indian Air Force aircraft, leaving trails of the tricolour in the sky.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed">
              Each year, a foreign dignitary is invited as the Chief Guest, reflecting India's global diplomatic relations and international friendships. The parade is broadcast live on national television, allowing millions of Indians to witness this grand spectacle from the comfort of their homes.
            </p>

            <h2 className="text-2xl font-bold mt-10 mb-4 text-foreground">Republic Day Celebrations Across India</h2>
            <p className="text-muted-foreground leading-relaxed">
              Republic Day is celebrated with great patriotic fervour not just in New Delhi, but across every corner of the country. From schools and colleges to government offices and community centres, the tricolour flies high and the national anthem resonates everywhere.
            </p>

            <h3 className="text-xl font-semibold mt-8 mb-3 text-foreground">How Republic Day Is Celebrated</h3>
            <ul className="list-disc pl-6 space-y-2 my-4">
              <li className="text-muted-foreground"><strong className="text-foreground">Flag hoisting ceremonies:</strong> The national flag is hoisted in schools, offices, and public places across India.</li>
              <li className="text-muted-foreground"><strong className="text-foreground">Cultural programmes:</strong> Students and community members perform patriotic songs, dances, and skits.</li>
              <li className="text-muted-foreground"><strong className="text-foreground">Republic Day speech competitions:</strong> Students deliver speeches on the significance of the day.</li>
              <li className="text-muted-foreground"><strong className="text-foreground">Republic Day essay writing contests:</strong> Schools organise essay writing competitions on topics related to the Constitution and national pride.</li>
              <li className="text-muted-foreground"><strong className="text-foreground">Parades at state and district levels:</strong> Mini parades are organised in state capitals and district headquarters.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed">
              Educational institutions play a vital role in instilling national values among students, making Republic Day celebrations an important part of the academic calendar.
            </p>

            <h2 className="text-2xl font-bold mt-10 mb-4 text-foreground">Republic Day Speech in English (For Students)</h2>
            <div className="bg-muted/30 p-6 rounded-lg my-6 border-l-4 border-primary">
              <p className="text-muted-foreground leading-relaxed mb-4">Good morning respected Principal, teachers, and my dear friends.</p>
              <p className="text-muted-foreground leading-relaxed mb-4">Today, we have gathered here to celebrate Republic Day, a day that marks the adoption of the Indian Constitution on 26 January 1950. This historic day reminds us that India is a democratic republic where every citizen has equal rights and responsibilities.</p>
              <p className="text-muted-foreground leading-relaxed mb-4">Our Constitution is the backbone of our nation, guiding us with the values of justice, liberty, equality, and fraternity. It was drafted by brilliant minds led by Dr. B. R. Ambedkar, who worked tirelessly to create a document that would protect the rights of every Indian citizen.</p>
              <p className="text-muted-foreground leading-relaxed mb-4">Republic Day also reminds us of the immense sacrifices made by our freedom fighters and leaders who gave everything they had to give us a free and strong nation. Their courage and determination continue to inspire us today.</p>
              <p className="text-muted-foreground leading-relaxed mb-4">As young citizens of India, it is our responsibility to understand our Constitution, respect its values, and contribute positively to the progress and unity of our country. Let us pledge to be good citizens who uphold democratic values and work towards making India a better place for all.</p>
              <p className="text-muted-foreground leading-relaxed font-semibold">Thank you. Jai Hind!</p>
            </div>

            <h2 className="text-2xl font-bold mt-10 mb-4 text-foreground">गणतंत्र दिवस भाषण हिंदी में (Republic Day Speech in Hindi)</h2>
            <div className="bg-muted/30 p-6 rounded-lg my-6 border-l-4 border-orange-500">
              <p className="text-muted-foreground leading-relaxed mb-4">आदरणीय प्रधानाचार्य महोदय, सम्मानित शिक्षकगण और मेरे प्रिय साथियों,</p>
              <p className="text-muted-foreground leading-relaxed mb-4">आज हम सभी यहाँ 26 जनवरी, गणतंत्र दिवस के पावन अवसर पर एकत्रित हुए हैं। इसी दिन 1950 में भारत का संविधान लागू हुआ और हमारा देश एक संप्रभु, लोकतांत्रिक गणराज्य बना।</p>
              <p className="text-muted-foreground leading-relaxed mb-4">हमारा संविधान हमें समानता, स्वतंत्रता, न्याय और बंधुत्व के मूल्य प्रदान करता है। यह हमें अपने अधिकारों और कर्तव्यों के प्रति जागरूक करता है।</p>
              <p className="text-muted-foreground leading-relaxed mb-4">गणतंत्र दिवस हमें हमारे स्वतंत्रता सेनानियों के बलिदानों की याद दिलाता है, जिनके कारण हम आज स्वतंत्र भारत में जी रहे हैं। इस अवसर पर हमें यह संकल्प लेना चाहिए कि हम संविधान के मूल्यों का पालन करें और अपने देश की प्रगति में योगदान दें।</p>
              <p className="text-muted-foreground leading-relaxed font-semibold">जय हिंद!</p>
            </div>

            <h2 className="text-2xl font-bold mt-10 mb-4 text-foreground">Republic Day Essay for School Students</h2>
            
            <h3 className="text-xl font-semibold mt-8 mb-3 text-foreground">Republic Day Essay (150 Words)</h3>
            <p className="text-muted-foreground leading-relaxed">
              Republic Day is celebrated every year on 26 January in India with great pride and patriotic spirit. On this day in 1950, the Constitution of India came into force, and India became a sovereign, democratic republic. The Constitution gives every citizen fundamental rights and also lays down important duties that help maintain unity and harmony in the country.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Republic Day is a national holiday, and it is celebrated across the nation with enthusiasm. The grand Republic Day parade held in New Delhi is one of the main attractions, showcasing India's cultural diversity, military strength, and technological progress. Schools, colleges, and institutions organise flag hoisting ceremonies, cultural programmes, speeches, and essay competitions.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Republic Day reminds us of the sacrifices made by our freedom fighters and leaders who worked tirelessly to build a strong nation. It inspires citizens to respect the Constitution and contribute positively to the progress and development of India.
            </p>

            <h3 className="text-xl font-semibold mt-8 mb-3 text-foreground">Republic Day Essay (300 Words)</h3>
            <p className="text-muted-foreground leading-relaxed">
              Republic Day is one of the most significant national festivals of India, celebrated every year on 26 January. This historic day marks the implementation of the Constitution of India in 1950, which transformed India into a sovereign, socialist, secular, and democratic republic. Dr. B. R. Ambedkar, the chief architect of the Constitution, played a vital role in shaping the legal and democratic foundation of the nation.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Republic Day symbolises the true spirit of democracy, equality, and justice. It reminds citizens that the power of the country lies in the hands of the people and that everyone is equal before the law. Unlike Independence Day, which celebrates freedom from British rule, Republic Day celebrates India's ability to govern itself through its Constitution.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              The Republic Day parade held at Kartavya Path in New Delhi is the highlight of the celebrations. It showcases India's cultural heritage through state tableaux, disciplined marching contingents of the armed forces, and impressive performances by school children. The parade reflects the unity in diversity that defines India.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Across the country, Republic Day is celebrated in schools, colleges, government offices, and communities. Students participate in speeches, essay writing, patriotic songs, and cultural programmes. Republic Day encourages citizens to understand their rights and responsibilities and to work together for national unity.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              In essence, Republic Day is a reminder of India's democratic values and a call to uphold the principles of the Constitution in everyday life.
            </p>

            <h2 className="text-2xl font-bold mt-10 mb-4 text-foreground">15 Best Republic Day Quotes for 2026</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Here are some inspiring Republic Day quotes perfect for students, schools, and social media:
            </p>
            <div className="bg-gradient-to-r from-orange-50 to-green-50 dark:from-orange-950/30 dark:to-green-950/30 p-6 rounded-lg my-6">
              <ol className="list-decimal pl-6 space-y-3">
                <li className="text-muted-foreground">"A nation's culture resides in the hearts and soul of its people." – Mahatma Gandhi</li>
                <li className="text-muted-foreground">"The Constitution is not a mere lawyer's document; it is a vehicle of life." – Dr. B. R. Ambedkar</li>
                <li className="text-muted-foreground">"Freedom is not given, it is taken." – Subhas Chandra Bose</li>
                <li className="text-muted-foreground">"Let us remember the golden heritage of our country and feel proud to be a part of India."</li>
                <li className="text-muted-foreground">"Republic Day reminds us that the strength of India lies in its Constitution and the unity of its people."</li>
                <li className="text-muted-foreground">"On Republic Day, we celebrate not just freedom, but the power of democracy, equality, and justice."</li>
                <li className="text-muted-foreground">"A true tribute on Republic Day is to follow the values written in our Constitution every day."</li>
                <li className="text-muted-foreground">"Republic Day is a reminder that India's diversity is its greatest strength."</li>
                <li className="text-muted-foreground">"Our Constitution gives us rights, but Republic Day reminds us of our responsibilities."</li>
                <li className="text-muted-foreground">"Let us honour the spirit of India by protecting its democracy and respecting its Constitution."</li>
                <li className="text-muted-foreground">"Republic Day celebrates the idea that every Indian is equal before the law."</li>
                <li className="text-muted-foreground">"The tricolour flies high on Republic Day because millions of Indians believe in unity and justice."</li>
                <li className="text-muted-foreground">"Republic Day is not just a date; it is a promise to uphold India's democratic values."</li>
                <li className="text-muted-foreground">"As we celebrate Republic Day, let us pledge to build a stronger, fairer, and united India."</li>
                <li className="text-muted-foreground font-semibold">"Proud to be an Indian. Happy Republic Day 2026!"</li>
              </ol>
            </div>

            <h2 className="text-2xl font-bold mt-10 mb-4 text-foreground">Republic Day Wishes and Messages 2026</h2>
            
            <h3 className="text-xl font-semibold mt-8 mb-3 text-foreground">Republic Day Wishes</h3>
            <ul className="list-disc pl-6 space-y-2 my-4">
              <li className="text-muted-foreground">Happy Republic Day 2026! May our nation continue to progress and prosper.</li>
              <li className="text-muted-foreground">Let us honour our Constitution and uphold the values it teaches us on this Republic Day.</li>
              <li className="text-muted-foreground">Wishing you pride and patriotism on this 26 January. Jai Hind!</li>
              <li className="text-muted-foreground">May the spirit of Republic Day fill your heart with love for our nation.</li>
              <li className="text-muted-foreground">Celebrate the glory of India on this 77th Republic Day!</li>
            </ul>

            <h3 className="text-xl font-semibold mt-8 mb-3 text-foreground">Republic Day WhatsApp Status</h3>
            <ul className="list-disc pl-6 space-y-2 my-4">
              <li className="text-muted-foreground">Jai Hind! Happy Republic Day 2026!</li>
              <li className="text-muted-foreground">Proud to be an Indian</li>
              <li className="text-muted-foreground">Constitution. Democracy. India.</li>
              <li className="text-muted-foreground">Saluting the spirit of India on Republic Day</li>
              <li className="text-muted-foreground">Let's celebrate democracy and unity!</li>
            </ul>

            <h2 className="text-2xl font-bold mt-10 mb-4 text-foreground">Republic Day DP Images for 2026</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Looking for the perfect Republic Day profile picture? Download these beautiful Republic Day DP images to show your patriotic spirit on social media:
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-8">
              {dpImages.map((image, i) => (
                <div key={i} className="relative group">
                  <img
                    src={image.src}
                    alt={image.alt}
                    width="300"
                    height="300"
                    className="w-full aspect-square object-cover rounded-lg border-2 border-orange-200 dark:border-orange-800 shadow-md"
                    loading="lazy"
                    decoding="async"
                  />
                  <a
                    href={image.src}
                    download={`republic-day-2026-dp-${i + 1}.png`}
                    className="absolute inset-0 bg-black/50 md:opacity-0 md:group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center"
                    data-testid={`download-republic-day-dp-${i + 1}`}
                  >
                    <Button size="sm" variant="secondary" className="gap-2">
                      <Download className="w-4 h-4" />
                      Download
                    </Button>
                  </a>
                  <p className="text-xs text-center mt-2 text-muted-foreground">{image.title}</p>
                </div>
              ))}
            </div>
            
            <p className="text-muted-foreground leading-relaxed">
              These images are perfect for WhatsApp DP, Instagram profile pictures, Facebook, and other social media platforms. Feel free to download and use them to celebrate Republic Day 2026!
            </p>

            <h2 className="text-2xl font-bold mt-10 mb-4 text-foreground">Republic Day vs Independence Day: Key Differences</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Many people wonder about the difference between Republic Day and Independence Day. Here's a clear comparison:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 my-6">
              <div className="bg-orange-50 dark:bg-orange-950/30 p-5 rounded-lg">
                <h4 className="font-bold text-foreground mb-3">Independence Day (15 August)</h4>
                <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                  <li>Celebrates freedom from British colonial rule</li>
                  <li>Marked the end of 200 years of British rule in 1947</li>
                  <li>Prime Minister hoists the flag at Red Fort, Delhi</li>
                  <li>Focus is on independence and freedom struggle</li>
                </ul>
              </div>
              <div className="bg-green-50 dark:bg-green-950/30 p-5 rounded-lg">
                <h4 className="font-bold text-foreground mb-3">Republic Day (26 January)</h4>
                <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                  <li>Celebrates the adoption of India's Constitution</li>
                  <li>Marked India becoming a sovereign democratic republic in 1950</li>
                  <li>President unfurls the flag at Kartavya Path, Delhi</li>
                  <li>Focus is on democracy, Constitution, and rule of law</li>
                </ul>
              </div>
            </div>

            <h2 className="text-2xl font-bold mt-10 mb-4 text-foreground">Frequently Asked Questions About Republic Day</h2>
            
            <div className="space-y-4 my-6">
              <div className="p-4 bg-muted/50 rounded-md">
                <p className="font-semibold text-foreground mb-2">Why is Republic Day celebrated on 26 January?</p>
                <p className="text-muted-foreground">Republic Day is celebrated on 26 January because the Constitution of India came into effect on this date in 1950. The date was chosen to commemorate the Purna Swaraj Declaration of 1930.</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-md">
                <p className="font-semibold text-foreground mb-2">Where is the Republic Day parade held?</p>
                <p className="text-muted-foreground">The main Republic Day parade is held at Kartavya Path (formerly Rajpath) in New Delhi, in the presence of the President of India.</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-md">
                <p className="font-semibold text-foreground mb-2">Who drafted the Indian Constitution?</p>
                <p className="text-muted-foreground">Dr. B. R. Ambedkar was the chief architect of the Indian Constitution. He chaired the Drafting Committee that prepared the final draft.</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-md">
                <p className="font-semibold text-foreground mb-2">Which Republic Day is celebrated in 2026?</p>
                <p className="text-muted-foreground">India will celebrate its 77th Republic Day on 26 January 2026.</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-md">
                <p className="font-semibold text-foreground mb-2">What is the significance of Republic Day for students?</p>
                <p className="text-muted-foreground">Republic Day teaches students about India's democratic values, the importance of the Constitution, and their rights and duties as citizens. Schools celebrate with flag hoisting, speeches, and cultural programmes.</p>
              </div>
            </div>

            <h2 className="text-2xl font-bold mt-10 mb-4 text-foreground">Conclusion: Celebrating India's Democratic Spirit</h2>
            <p className="text-muted-foreground leading-relaxed">
              Republic Day is not just a national holiday; it is a powerful reminder of India's democratic foundation and constitutional values. From the grand parade in New Delhi to the celebrations in every school and community across the nation, this day inspires unity, responsibility, and pride among all Indians.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              As we celebrate 26 January 2026 and India's 77th Republic Day, let us pledge to uphold the Constitution, respect the sacrifices of our freedom fighters, and contribute towards building a stronger, more inclusive, and progressive India.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              At Rainbow Preschool International, we believe in nurturing young minds with values of patriotism, unity, and respect for our nation's heritage. Our centres across Thane celebrate Republic Day with flag hoisting ceremonies, patriotic songs, and activities that help young children understand and appreciate their country.
            </p>
            <p className="text-xl font-bold text-center mt-8 text-primary">Happy Republic Day 2026! Jai Hind!</p>

            {/* Related Content Section for Better Engagement */}
            <div className="mt-12 pt-8 border-t border-border">
              <h3 className="text-xl font-bold text-foreground mb-6">Explore More at Rainbow Preschool</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Link href="/programmes" data-testid="link-related-programmes">
                  <div className="p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer group">
                    <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">Our Programmes</h4>
                    <p className="text-sm text-muted-foreground mt-1">Discover age-appropriate learning for children 1.5-10 years</p>
                  </div>
                </Link>
                <Link href="/about" data-testid="link-related-about">
                  <div className="p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer group">
                    <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">About Us</h4>
                    <p className="text-sm text-muted-foreground mt-1">18+ years of nurturing young minds in Thane</p>
                  </div>
                </Link>
                <Link href="/blog" data-testid="link-related-blog">
                  <div className="p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer group">
                    <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">Blogs</h4>
                    <p className="text-sm text-muted-foreground mt-1">Latest updates and parenting insights</p>
                  </div>
                </Link>
                <Link href="/admissions" data-testid="link-related-admissions">
                  <div className="p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer group">
                    <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">Admissions 2026-27</h4>
                    <p className="text-sm text-muted-foreground mt-1">Join the Rainbow family - limited seats available</p>
                  </div>
                </Link>
                <Link href="/playgroup" data-testid="link-related-playgroup">
                  <div className="p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer group">
                    <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">Playgroup (1.5-2.5 yrs)</h4>
                    <p className="text-sm text-muted-foreground mt-1">First steps in learning through play</p>
                  </div>
                </Link>
                <Link href="/contact" data-testid="link-related-contact">
                  <div className="p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer group">
                    <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">Contact Us</h4>
                    <p className="text-sm text-muted-foreground mt-1">Visit our centres across Thane</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </article>

      <section className="py-10 md:py-12 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-5 text-center">Explore Rainbow Preschool</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Link href="/best-preschool-near-me-in-thane" className="flex flex-col items-center gap-1.5 p-3 md:p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-md transition-all text-center" data-testid="link-republic-best-preschool">
              <Award className="w-5 h-5 text-primary" />
              <span className="text-xs md:text-sm font-medium text-gray-800 dark:text-gray-100 leading-tight">Award-Winning Preschool</span>
            </Link>
            <Link href="/preschool-near-me" className="flex flex-col items-center gap-1.5 p-3 md:p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-md transition-all text-center" data-testid="link-republic-near-me">
              <MapPin className="w-5 h-5 text-primary" />
              <span className="text-xs md:text-sm font-medium text-gray-800 dark:text-gray-100 leading-tight">Find Nearest Centre</span>
            </Link>
            <Link href="/gallery" className="flex flex-col items-center gap-1.5 p-3 md:p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-md transition-all text-center" data-testid="link-republic-gallery">
              <Images className="w-5 h-5 text-primary" />
              <span className="text-xs md:text-sm font-medium text-gray-800 dark:text-gray-100 leading-tight">Photo Gallery</span>
            </Link>
            <Link href="/preschool-admissions" className="flex flex-col items-center gap-1.5 p-3 md:p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-md transition-all text-center" data-testid="link-republic-admissions">
              <ClipboardList className="w-5 h-5 text-primary" />
              <span className="text-xs md:text-sm font-medium text-gray-800 dark:text-gray-100 leading-tight">Admission Process</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="border-blue-200/60 bg-blue-50/30">
          <CardContent className="pt-5 pb-4">
            <p className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-2">Part of Rainbow Group</p>
            <h3 className="text-lg font-semibold mb-2">Continue the Journey with Rainbow International School</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Looking ahead to primary and secondary education? Our sister institution, <a href="https://rainbowinternationalschool.in" target="_blank" rel="noopener" className="text-blue-600 font-medium hover:underline">Rainbow International School</a>, offers a seamless CBSE-affiliated K–12 pathway from Nursery to Class 12 in Thane West.
            </p>
            <div className="flex flex-wrap gap-2">
              <a href="https://rainbowinternationalschool.in/pre-primary-school-thane" target="_blank" rel="noopener" className="text-xs bg-blue-100 text-blue-700 rounded-full px-3 py-1 font-medium hover:bg-blue-200 transition-colors" data-testid="link-republic-ris-preprimary">Pre-Primary</a>
              <a href="https://rainbowinternationalschool.in/primary-section" target="_blank" rel="noopener" className="text-xs bg-blue-100 text-blue-700 rounded-full px-3 py-1 font-medium hover:bg-blue-200 transition-colors" data-testid="link-republic-ris-primary">Primary School</a>
              <a href="https://rainbowinternationalschool.in/curriculum" target="_blank" rel="noopener" className="text-xs bg-blue-100 text-blue-700 rounded-full px-3 py-1 font-medium hover:bg-blue-200 transition-colors" data-testid="link-republic-ris-curriculum">CBSE Curriculum</a>
              <a href="https://rainbowinternationalschool.in/contact-us" target="_blank" rel="noopener" className="text-xs bg-blue-100 text-blue-700 rounded-full px-3 py-1 font-medium hover:bg-blue-200 transition-colors" data-testid="link-republic-ris-admissions">Admissions</a>
            </div>
          </CardContent>
        </Card>
      </section>

      <CTASection />
    </div>
  );
}
