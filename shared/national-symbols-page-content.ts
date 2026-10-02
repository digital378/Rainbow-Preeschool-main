import { NATIONAL_SYMBOLS_CRAFTS } from "./national-symbols-craft-data";
import { NATIONAL_SYMBOLS_FAQS } from "./national-symbols-faq-data";

export type NationalSymbolZone = "identity" | "wild" | "nature";
export type NationalSymbol = {
  id: string; name: string; hindi: string | null; category: string; zone: NationalSymbolZone; unofficial: boolean;
  spotted: string; fact: string; toddler: string; preschooler: string; tryThis: string | null; link?: string;
};

export const NATIONAL_SYMBOLS = [
  { id:"flag",name:"National Flag — Tiranga",hindi:"राष्ट्रीय ध्वज (तिरंगा)",category:"flag",zone:"identity",unofficial:false,spotted:"Outside schools and government buildings, and everywhere on 15 August and 26 January.",fact:"The flag has three colours and a wheel with 24 spokes called the Ashoka Chakra — adopted on 22 July 1947.",toddler:"Our flag has three colours — orange, white and green — and a little blue wheel in the middle. We wave it because we love India!",preschooler:"Saffron stands for courage, white stands for peace and truth, and green stands for growth and land. The blue wheel in the middle is called the Ashoka Chakra — it has 24 spokes, like the hours in a day, and reminds us that India keeps moving forward.",tryThis:"Want to make your own Tiranga? We've put a full step-by-step flag craft in our Independence Day guide — hop over after you finish the trail!",link:"/blog/independence-day-for-kids"},
  { id:"emblem",name:"National Emblem",hindi:"राष्ट्रीय प्रतीक",category:"emblem",zone:"identity",unofficial:false,spotted:"Indian coins, passports, currency notes and government letters.",fact:"The emblem shows four lions standing back-to-back, though only three are ever visible at once. It was adopted on 26 January 1950 and comes from a stone pillar built by Emperor Ashoka over 2,000 years ago.",toddler:"Look for the little lion picture on a coin — that's our country's special stamp!",preschooler:"Our national emblem has four lions standing back-to-back, though we can only see three at a time. Underneath is written \"Satyameva Jayate,\" which means \"Truth Alone Triumphs.\" It comes from a very old stone pillar built by an emperor named Ashoka.",tryThis:"Try a coin rubbing — place a coin under paper and gently rub a crayon over it to reveal the lions."},
  { id:"anthem",name:"National Anthem — Jana Gana Mana",hindi:"राष्ट्रगान (जन गण मन)",category:"anthem",zone:"identity",unofficial:false,spotted:"Morning assembly, Republic Day, Independence Day, and before films in some cinemas.",fact:"Jana Gana Mana was written by the poet Rabindranath Tagore and takes about 52 seconds to sing from start to end.",toddler:"We stand up tall and quiet when this special song plays.",preschooler:"Our national anthem was written by a poet named Rabindranath Tagore. It takes almost exactly 52 seconds to sing — try timing it next time!",tryThis:"Practise standing tall and still for 52 seconds — see if you can do it without wiggling!"},
  { id:"song",name:"National Song — Vande Mataram",hindi:"राष्ट्रीय गीत (वन्दे मातरम्)",category:"song",zone:"identity",unofficial:false,spotted:"Independence Day and Republic Day celebrations, alongside the national anthem.",fact:"Vande Mataram means \"I bow to thee, Mother\" and comes from a novel called Anandamath, written by Bankim Chandra Chattopadhyay in 1882.",toddler:"This is another special song about loving our country, like a big hug for India.",preschooler:"Vande Mataram was written inside a story-book almost 150 years ago! In 1950, it was declared just as special as our national anthem.",tryThis:"Ask a grandparent if they remember singing this at school — a lovely way to start a conversation."},
  { id:"pledge",name:"National Pledge",hindi:"राष्ट्रीय प्रतिज्ञा",category:"pledge",zone:"identity",unofficial:false,spotted:"Recited by children every morning at school assembly across India.",fact:"The pledge begins, \"India is my country and all Indians are my brothers and sisters.\" It was written by Pydimarri Venkata Subba Rao and has been recited in schools since 1965.",toddler:"Every morning, children across India say the same kind promise together.",preschooler:"The pledge is a promise about loving our country and being kind to every Indian, like one big family. Children have been saying it every morning since 1965!",tryThis:"Make up your own two-line \"kindness pledge\" together — what would your child promise to do for their friends?"},
  { id:"rupee",name:"National Currency Symbol — ₹",hindi:"रुपया चिह्न (₹)",category:"currency",zone:"identity",unofficial:false,spotted:"On every rupee note and coin, and on price tags.",fact:"The ₹ symbol was designed by D. Udaya Kumar and was officially chosen in 2010. It blends the Devanagari letter \"र\" with a horizontal line.",toddler:"This little sign means \"rupee\" — it's on all our money!",preschooler:"This symbol was designed by a real design student and chosen especially for India in 2010, so our money would have its own special sign — just like the $ for dollars.",tryThis:"Go on a \"symbol hunt\" through your coin jar or wallet together and spot the ₹ sign."},
  { id:"calendar",name:"National Calendar — Saka Calendar",hindi:"राष्ट्रीय पंचांग (शक संवत)",category:"calendar",zone:"identity",unofficial:false,spotted:"Printed at the top of the Gazette of India and used in All India Radio broadcasts.",fact:"Alongside the regular calendar on our walls, the Indian government also uses a special calendar called the Saka calendar, adopted in 1957, for official work.",toddler:"Our country's government has a second special calendar, just for important papers!",preschooler:"Most of us use the regular calendar with January, February and so on. But India's government also keeps a second calendar, called the Saka calendar, that started a very long time ago and is still used today.",tryThis:null},
  { id:"tiger",name:"National Animal — Royal Bengal Tiger",hindi:"राष्ट्रीय पशु (बाघ)",category:"animal",zone:"wild",unofficial:false,spotted:"Ranthambore, Sundarbans, and other tiger reserves across India.",fact:"India is home to roughly 3 out of every 4 wild tigers left on Earth (about 70–75% of the world's population). The tiger became our national animal in 1972.",toddler:"The tiger is big, orange and stripy, and India takes very good care of them.",preschooler:"More wild tigers live in India than in any other country in the world. That's why keeping their forests safe is so important for the whole planet.",tryThis:"Paint orange and black stripes on a paper plate to make your own tiger mask."},
  { id:"peacock",name:"National Bird — Indian Peacock",hindi:"राष्ट्रीय पक्षी (मोर)",category:"bird",zone:"wild",unofficial:false,spotted:"Gardens, forests and farmland across India.",fact:"Only the male peacock has the giant, colourful tail — he fans it out and dances to impress a peahen! It was declared our national bird in 1963.",toddler:"The peacock has beautiful blue and green feathers and loves to dance.",preschooler:"Did you know only boy peacocks have the giant colourful tail? He spreads it open like a fan and dances, especially when rain is on the way.",tryThis:"Trace your hand and turn the fingers into peacock feathers with paint."},
  { id:"dolphin",name:"National Aquatic Animal — Ganges River Dolphin",hindi:"राष्ट्रीय जलीय जीव (गंगा डॉल्फ़िन)",category:"aquatic animal",zone:"wild",unofficial:false,spotted:"The Ganga and a few other rivers of northern India.",fact:"This gentle dolphin is almost blind — it finds its way and its food using sound, like a whisper-quiet radar. It was declared our national aquatic animal in 2010.",toddler:"There's a special dolphin that lives in our rivers, not the sea!",preschooler:"This dolphin can barely see with its eyes, but it \"sees\" with sound instead — it sends out clicks and listens for them to bounce back, a bit like how bats find their way in the dark.",tryThis:"Play an echolocation game — close your eyes and try to find a clapping friend by sound alone!"},
  { id:"cobra",name:"National Reptile — King Cobra",hindi:"राष्ट्रीय सरीसृप (किंग कोबरा)",category:"reptile",zone:"wild",unofficial:true,spotted:"The forests of the Western Ghats and Northeast India.",fact:"The King Cobra is the longest venomous snake in the world — and despite its fearsome reputation, it usually avoids people and only defends itself if threatened. It's popularly known as India's national reptile, though — unlike the flag or the tiger — this isn't an official government title.",toddler:"Snakes are wild animals we watch from a safe distance and never touch.",preschooler:"The King Cobra is famous for being the longest venomous snake on Earth. Like most wild animals, it would rather hide from us than meet us — we admire it from books and glass enclosures at the zoo, not up close.",tryThis:"Draw a long, winding snake path on paper and see how far you can make it stretch!"},
  { id:"elephant",name:"National Heritage Animal — Indian Elephant",hindi:"राष्ट्रीय धरोहर पशु (हाथी)",category:"heritage animal",zone:"wild",unofficial:false,spotted:"Southern and northeastern Indian forests, and in many temple traditions.",fact:"Elephants have excellent memories and live in caring family herds led by the oldest female. The elephant was declared our National Heritage Animal in 2010.",toddler:"The elephant is big, gentle and never forgets its family.",preschooler:"Elephant herds are led by the oldest, wisest female, called the matriarch, and the whole family helps look after the babies together — a bit like a big, caring family.",tryThis:"Make an elephant handprint — palm as the head, fingers spread out as the trunk and ears!"},
  { id:"lotus",name:"National Flower — Lotus",hindi:"राष्ट्रीय पुष्प (कमल)",category:"flower",zone:"nature",unofficial:true,spotted:"Ponds and lakes across India, and on the cover of the Indian passport.",fact:"Even though almost everyone believes the lotus is India's official national flower, the government has confirmed in Parliament that no such official notification has ever been issued. It's the country's much-loved, traditionally recognised flower — just not a formal title.",toddler:"The lotus is a pretty pink flower that grows in muddy water.",preschooler:"The lotus grows up through muddy water and still opens into a perfectly clean, beautiful flower — which is why people say it reminds us that we can rise above anything messy or difficult.",tryThis:"Make a lotus stamp print using a cut potato dipped in pink and white paint."},
  { id:"mango",name:"National Fruit — Mango",hindi:"राष्ट्रीय फल (आम)",category:"fruit",zone:"nature",unofficial:true,spotted:"Orchards across India, especially in summer — and probably your own fridge!",fact:"India grows more mangoes than any other country — over 1,000 different varieties. It's traditionally called the \"king of fruits,\" though, like the lotus, it has no official government title.",toddler:"Mango is sweet, golden, and one of our favourite summer fruits.",preschooler:"India grows over a thousand kinds of mangoes — imagine tasting a different one every day for years! That's why it's lovingly called the \"king of fruits.\"",tryThis:"Try a mango taste-test at home and see if you can guess the variety by smell alone. (Peek at our tiffin box ideas for more mango recipes!)",link:"/blog/healthy-tiffin-box-ideas-preschoolers"},
  { id:"banyan",name:"National Tree — Banyan",hindi:"राष्ट्रीय वृक्ष (बरगद)",category:"tree",zone:"nature",unofficial:true,spotted:"Village squares, temple courtyards and old city streets across India.",fact:"A banyan tree grows new roots down from its own branches, and those roots grow into new trunks — so one banyan tree can eventually look like an entire forest. It's traditionally, though not officially, recognised as India's national tree.",toddler:"This giant tree gives lots of shade for people to rest under.",preschooler:"A banyan tree keeps growing new roots from its branches down to the ground, and those roots turn into new trunks — one single tree can spread out and look like a whole grove!",tryThis:"Take a leaf rubbing — place a leaf under paper and rub gently with a crayon to reveal its veins."},
  { id:"pumpkin",name:"National Vegetable — Pumpkin",hindi:"राष्ट्रीय सब्ज़ी (कद्दू)",category:"vegetable",zone:"nature",unofficial:true,spotted:"Kitchen gardens and markets across India.",fact:"Pumpkin has no official government title either, but it's a much-loved, popularly recognised symbol thanks to how common, colourful and useful it is in Indian kitchens.",toddler:"Pumpkin is round, orange, and yummy in soup!",preschooler:"Pumpkins are full of seeds — hundreds of them inside just one pumpkin! One single plant can grow enough to help feed a whole family.",tryThis:"Scoop, count and wash pumpkin seeds together — a wonderfully messy sensory activity."},
  { id:"ganga",name:"National River — Ganga",hindi:"राष्ट्रीय नदी (गंगा)",category:"river",zone:"nature",unofficial:false,spotted:"Flowing through the northern Indian plains, from the Himalayas to the Bay of Bengal.",fact:"The Ganga was officially declared India's National River in November 2008. Millions of people depend on it every day for water, farming and daily life.",toddler:"The Ganga is a very big, very important river.",preschooler:"The Ganga begins high up in the snowy Himalayas and travels a very long way before reaching the sea, giving water to millions of people, plants and animals along the way. That's why we try to keep it clean.",tryThis:"Talk about one simple way your family can save water at home this week."},
] satisfies NationalSymbol[];

export const NATIONAL_SYMBOLS_QUICK_LIST = NATIONAL_SYMBOLS.map(
  ({ id, name }) => [id, name] as const,
);

export const NATIONAL_SYMBOL_IMAGE_SOURCES: Record<string, string> = {
  flag: "/images/symbols/flag.webp",
  emblem: "/images/symbols/emblem.webp",
  anthem: "/images/symbols/anthem.webp",
  song: "/images/symbols/song.webp",
  pledge: "/images/symbols/pledge.webp",
  rupee: "/images/symbols/rupee.webp",
  calendar: "/images/symbols/calendar.webp",
  tiger: "/images/symbols/tiger.webp",
  peacock: "/images/symbols/peacock.webp",
  dolphin: "/images/symbols/dolphin.webp",
  cobra: "/images/symbols/cobra.webp",
  elephant: "/images/symbols/elephant.webp",
  lotus: "/images/symbols/lotus.webp",
  mango: "/images/symbols/mango.webp",
  banyan: "/images/symbols/banyan.webp",
  pumpkin: "/images/symbols/pumpkin.webp",
  ganga: "/images/symbols/ganga.webp",
};

export const NATIONAL_SYMBOL_IMAGE_ALT_TEXT: Record<string, string> = {
  flag: "Indian national flag Tiranga with the Ashoka Chakra",
  emblem: "Lion Capital of Ashoka, India's national emblem",
  anthem: "Open music book representing Jana Gana Mana, India's national anthem",
  song: "Musical notes representing Vande Mataram, India's national song",
  pledge: "Scroll representing India's national pledge",
  rupee: "Indian rupee symbol ₹, the national currency symbol of India",
  calendar: "Calendar illustration representing the Saka calendar, India's national calendar",
  tiger: "Royal Bengal Tiger, national animal of India",
  peacock: "Indian Peacock, national bird of India",
  dolphin: "Ganges River Dolphin, national aquatic animal of India",
  cobra: "King Cobra, popularly recognised as India's national reptile",
  elephant: "Indian Elephant, national heritage animal of India",
  lotus: "Lotus, traditionally recognised national flower of India",
  mango: "Mango, traditionally recognised national fruit of India",
  banyan: "Banyan tree, traditionally recognised national tree of India",
  pumpkin: "Pumpkin, popularly recognised national vegetable of India",
  ganga: "River illustration representing the Ganga, India's national river",
};

export const NATIONAL_SYMBOL_MATCH_PAIRS = [
  ["flag", "Tiranga"],
  ["emblem", "Four Lions"],
  ["tiger", "National Animal"],
  ["peacock", "National Bird"],
  ["lotus", "National Flower"],
  ["mango", "National Fruit"],
  ["banyan", "National Tree"],
  ["elephant", "National Heritage Animal"],
  ["dolphin", "National Aquatic Animal"],
  ["cobra", "National Reptile"],
  ["pumpkin", "National Vegetable"],
  ["rupee", "National Currency"],
] as const;

export const NATIONAL_SYMBOL_ZONES = [
  {id:"identity",title:"Zone 1 — The Nation's Identity",intro:"These are the symbols India chose for itself — a flag, a song, a promise, a sign on every coin. They tell the story of who we are as one country made of many people.",accent:"#b5653c"},
  {id:"wild",title:"Zone 2 — The Wild Trail",intro:"India shares its land with some extraordinary animals. These five were chosen to represent the country's wild beauty — spot them at the zoo, in a book, or even on your next holiday.",accent:"#3e756d"},
  {id:"nature",title:"Zone 3 — The Nature Garden",intro:"From a flower that blooms in mud to a mighty tree with a thousand roots, these symbols come from India's gardens, orchards and riverbanks.",accent:"#6d8751"},
] satisfies Array<{id: NationalSymbolZone; title: string; intro: string; accent: string}>;

export const NATIONAL_SYMBOL_RIDDLES = [
 ["I have a hundred eyes on my tail, but I cannot see. I dance when it starts to rain. What am I?","The Peacock!","peacock"],
 ["I am orange, white and green, and I wave high above school gates. What am I?","The National Flag!","flag"],
 ["I grow in muddy water but come out perfectly clean. What am I?","The Lotus!","lotus"],
 ["I am huge, grey and gentle, and I never forget a face. What am I?","The Elephant!","elephant"],
 ["I am golden and sweet, and India grows more of me than anyone else in the world. What am I?","The Mango!","mango"],
 ["I live in the river, not the sea, and I \"see\" with sound instead of my eyes. What am I?","The Ganges River Dolphin!","dolphin"],
 ["I have four lions, but you can only ever see three of me at once. What am I?","The National Emblem!","emblem"],
 ["I am orange and black, and there are more of my kind in India than anywhere else on Earth. What am I?","The Tiger!","tiger"],
] as const;

export const NATIONAL_SYMBOLS_LINKS = {
  preschoolAdmissions: "/preschool-admissions",
  programmes: "/programmes",
  kindergarten: "/kindergarten",
  about: "/about",
  nursery: "/nursery",
  independenceDayGuide: "/blog/independence-day-for-kids",
  republicDayGuide: "/blog/republic-day-2026",
} as const;

export const NATIONAL_SYMBOLS_COPY = {
  heroTitle: "India's Symbol Trail: 17 National Symbols of India for Kids",
  heroDescription: "An interactive field guide, passport and playtime adventure for little explorers.",
  whyTitle: "Why We Collect These Symbols",
  quickListTitle: "List of 17 national symbols of India",
  symbolsCountTitle: "17 or 20 national symbols of India?",
  symbolsCountDescription: "You may see lists of 17, 20 or more national symbols. This guide covers 17 widely recognised symbols. Longer lists often add India's national motto, 'Satyameva Jayate' ('Truth Alone Triumphs'), which appears below the national emblem, and sometimes a national game. Many lists name hockey as India's national game, but the Government of India has not officially declared a national game.",
  introduction: "Long before a child can read a map, they can spot a peacock's feather, point to a tiger in a picture book, or notice the tricolour fluttering outside a building and ask, \"What is that?\" That curiosity is the beginning of belonging. At Rainbow Preschool International, we believe a child's love for their country doesn't start with a history lesson — it starts with noticing the world around them, one small discovery at a time.",
  guideDescription: "India has 17 widely recognised national symbols — from the Tiranga flag to the gentle Ganges river dolphin — each one a small window into the country's culture, wildlife and identity. This guide turns all 17 into a playful trail: sort them into three explorer zones, meet each one through a simple field-guide card, solve a few riddles, play a matching game, and even fill your own printable Symbol Passport along the way.",
  ageAppropriateBefore: "Ready for more age-appropriate discovery? Explore",
  kindergartenLinkText: "our Kindergarten programme",
  aboutLinkText: "About Rainbow Preschool",
  nurseryLinkText: "Our Nursery curriculum",
  ageAppropriateAfter: ".",
  quote: "“A child who can name the peacock, the banyan tree and the tricolour flag is already falling in love with India — one small discovery at a time.” — Rainbow Preschool International",
  myth: "Most people think the lotus is India's official national flower — even some grown-ups! But the government has clarified that it was never formally notified. The same is true for the mango, the banyan tree, the pumpkin and the king cobra — they're all much-loved, traditionally recognised symbols, but not official government titles like the flag, the anthem or the tiger. We think that makes them even more fun to learn about — loving a symbol doesn't need an official stamp!",
  riddleIntro: "Read the riddle aloud, let your little explorer guess, then tap to reveal the answer.",
  passportDescription: "Turn this whole trail into a keepsake! Download our free Symbol Passport — a foldable, printable booklet with a stamp box for all 17 symbols. After your child learns about a symbol, let them colour in its stamp box. By the end, they'll have a passport full of proud little stamps — and a wonderful record of everything they've discovered about India.",
  passportPrint: "Print on A4, fold along the marked lines, and staple once down the spine to make a mini booklet.",
  nextDescription: "This trail is just one part of how we bring India to life at Rainbow Preschool International. If you're getting ready for a festival, here's where to go next:",
  independenceBefore: "Preparing for 15 August? Visit our",
  independenceLinkText: "full Independence Day 2026 guide",
  independenceAfter: "for speeches, rhymes, craft ideas and more.",
  republicBefore: "Preparing for 26 January? Visit our",
  republicLinkText: "Republic Day 2026 guide",
  republicActivitiesLinkText: "Republic Day activities for kids",
  republicAfter: "for the parade, simple speeches and family activities.",
  allYear: "This Symbol Trail, though, is designed to be read any day of the year — it's less about one date, and more about getting to know India, one symbol at a time.",
  rainbowPreschool: "Give your little explorer the most joyful start to their learning journey. Experienced, caring early-years faculty, smart classrooms, CCTV-enabled safety, and a warm atmosphere where curiosity is always welcome.",
  rainbowSchool: "Looking ahead to primary and secondary education? Our sister institution, Rainbow International School, offers a seamless CBSE-affiliated K–12 pathway from Nursery to Class 12 in Thane West.",
  closing: "Every symbol your child learns is a small step toward loving the country they call home. Come see how we bring India — and the whole world — to life in our classrooms.",
} as const;

export const NATIONAL_SYMBOLS_SSR_COPY = [
  NATIONAL_SYMBOLS_COPY.heroTitle, NATIONAL_SYMBOLS_COPY.heroDescription, NATIONAL_SYMBOLS_COPY.whyTitle,
  NATIONAL_SYMBOLS_COPY.quickListTitle, ...NATIONAL_SYMBOLS_QUICK_LIST.map(([,label])=>label),
  NATIONAL_SYMBOLS_COPY.symbolsCountTitle, NATIONAL_SYMBOLS_COPY.symbolsCountDescription,
  NATIONAL_SYMBOLS_COPY.introduction, NATIONAL_SYMBOLS_COPY.guideDescription,
  NATIONAL_SYMBOLS_COPY.ageAppropriateBefore, NATIONAL_SYMBOLS_COPY.kindergartenLinkText,
  NATIONAL_SYMBOLS_COPY.aboutLinkText, NATIONAL_SYMBOLS_COPY.nurseryLinkText,
  NATIONAL_SYMBOLS_COPY.ageAppropriateAfter, NATIONAL_SYMBOLS_COPY.quote,
  ...NATIONAL_SYMBOL_ZONES.flatMap(({title,intro})=>[title,intro]),
  // The visitor page defaults each symbol card to its preschooler explanation.
  ...NATIONAL_SYMBOLS.flatMap(({name,hindi,spotted,fact,preschooler,tryThis})=>[name,hindi ?? "",spotted,fact,preschooler,tryThis ?? ""]),
  NATIONAL_SYMBOLS_COPY.myth, ...NATIONAL_SYMBOL_RIDDLES.flatMap(([question,answer])=>[question,answer]),
  NATIONAL_SYMBOLS_COPY.riddleIntro, NATIONAL_SYMBOLS_COPY.passportDescription, NATIONAL_SYMBOLS_COPY.passportPrint,
  NATIONAL_SYMBOLS_COPY.nextDescription, NATIONAL_SYMBOLS_COPY.independenceBefore, NATIONAL_SYMBOLS_COPY.independenceLinkText,
   NATIONAL_SYMBOLS_COPY.independenceAfter, NATIONAL_SYMBOLS_COPY.republicBefore, NATIONAL_SYMBOLS_COPY.republicLinkText,
   NATIONAL_SYMBOLS_COPY.republicActivitiesLinkText,
  NATIONAL_SYMBOLS_COPY.republicAfter,
  NATIONAL_SYMBOLS_COPY.allYear, NATIONAL_SYMBOLS_COPY.rainbowPreschool, NATIONAL_SYMBOLS_COPY.rainbowSchool, NATIONAL_SYMBOLS_COPY.closing,
  ...NATIONAL_SYMBOLS_FAQS.flat(),
  ...NATIONAL_SYMBOLS_CRAFTS.flatMap(({name,instruction,time,ages})=>[name,instruction,time,ages]),
].join("\n");