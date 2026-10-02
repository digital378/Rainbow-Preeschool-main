/**
 * National Symbols of India (Symbol Trail) FAQs — single source of truth.
 *
 * Used by BOTH the client page (client/src/pages/national-symbols-of-india.tsx)
 * and the bot-SSR entry (server/ssr-pages.ts) so the visible accordion and the
 * FAQPage JSON-LD can never drift apart.
 *
 * Tuples are [question, answer] to match the page's existing rendering.
 * Text must stay verbatim — the FAQPage schema is generated from this file.
 */

export const NATIONAL_SYMBOLS_FAQS: ReadonlyArray<readonly [string, string]> = [
  ["What are the 17 national symbols of India?","India is widely recognised to have 17 national symbols, covering everything from the flag and anthem to wildlife and nature: the National Flag, Emblem, Anthem, Song, Pledge, Currency Symbol, Calendar, Animal (Tiger), Bird (Peacock), Aquatic Animal (River Dolphin), Reptile (King Cobra), Heritage Animal (Elephant), Flower (Lotus), Fruit (Mango), Tree (Banyan), Vegetable (Pumpkin) and River (Ganga). A few of these, like the lotus and mango, are traditionally recognised rather than formally gazetted by the government — we've marked those clearly throughout this guide."],
  ["How many national symbols does India have — 17 or 20?","You may see lists of 17, 20 or more national symbols, but this guide covers 17 widely recognised symbols. Longer lists often add India's national motto, 'Satyameva Jayate' ('Truth Alone Triumphs'), which appears below the national emblem, and sometimes a national game; however, the Government of India has not officially declared a national game."],
  ["Which national symbols should LKG and UKG children learn?","Start with the flag, peacock, tiger, lotus, mango and the ₹ sign, which children can easily spot, then add the anthem, emblem and banyan tree as they grow."],
  ["What is the national symbol of India for kids to learn first?","Most preschools start with the National Flag, since children usually see it first — outside school, at assemblies, or on 15 August and 26 January. Its three simple colours and one shape (the Ashoka Chakra) make it an easy, visual starting point before moving on to the wildlife and nature symbols."],
  ["What is India's national flower, fruit, animal and bird?","India's national animal is the Royal Bengal Tiger and its national bird is the Indian Peacock — both official government designations. The lotus (flower) and mango (fruit) are the country's traditionally loved choices, though neither has ever been formally notified by the government."],
  ["Why is the Lion Capital of Ashoka India's national emblem?","The Lion Capital of Ashoka was chosen as India's national emblem on 26 January 1950 because it once crowned a stone pillar built by Emperor Ashoka over 2,000 years ago, and its motto, 'Satyameva Jayate' ('Truth Alone Triumphs'), reflected the values of the newly independent nation."],
  ["What do the colours of the Indian flag mean?","Saffron represents courage and sacrifice, white represents peace and truth, and green represents growth and the land. The navy-blue wheel in the centre, the Ashoka Chakra, has 24 spokes and represents continuous progress."],
  ["How long does it take to sing the Indian national anthem?","The full version of Jana Gana Mana takes approximately 52 seconds to sing. A shorter version, using only the first and last lines, takes about 20 seconds and is sometimes used at shorter events."],
  ["At what age should children start learning national symbols?","Children can start recognising simple symbols like the flag and the peacock from around age 2–3, through pictures, colours and songs. Around age 4–5, they can begin to understand the 'why' behind a few symbols, such as the meaning of the flag's colours, in very simple words."],
  ["What is a simple way to explain the national emblem to a toddler?","You can say, 'It's our country's special stamp with lions on it — you can find it on coins!' That's enough for a toddler; the fuller story (Ashoka's pillar, the motto) can wait until they're a little older."],
  ["What craft activities help kids remember national symbols?","Hands-on crafts tied to a specific symbol work best — a coin rubbing for the emblem, a handprint peacock, a potato-print lotus, or a leaf rubbing for the banyan tree. Making something with their hands helps a symbol stick in a child's memory far better than just being told about it."],
  ["Is Hindi India's national language?","No — this is one of the most common myths. India's Constitution does not declare any single national language; Hindi and English are the two official languages used by the central government, alongside 22 other scheduled languages recognised across the country."],
  ["What is the difference between a national symbol and a national festival?","A national symbol (like the flag, the tiger or the lotus) is a lasting emblem that represents the country all year round, while a national festival (like Independence Day or Republic Day) is a specific date on which the country celebrates a historic event. Many symbols, like the flag, appear especially prominently during festivals."],
  ["Does Rainbow Preschool teach national symbols as part of its curriculum?","Rainbow Preschool International follows a play-based curriculum aligned with NEP 2020, where children learn through stories, crafts and songs. You're welcome to book a visit at any of our 6 centres in Thane."],
];

/** Pre-flattened for FAQPage JSON-LD (client createFAQSchema + SSR structuredData). */
export const NATIONAL_SYMBOLS_FAQ_SCHEMA_ITEMS = NATIONAL_SYMBOLS_FAQS.map(
  ([question, answer]) => ({ question, answer }),
);
