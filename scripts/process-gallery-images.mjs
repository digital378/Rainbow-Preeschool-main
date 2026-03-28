import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const SRC = '/tmp/gallery_photos';
const DEST = 'client/public/images/gallery';

const IMAGE_MAP = [
  // Activities
  { src: 'Activities/Book Character Day.heif',           out: 'rainbow-preschool-activity-book-character-day.webp',       heic: true },
  { src: "Activities/Children's Day.jpg",                out: 'rainbow-preschool-childrens-day-activity.webp' },
  { src: "Activities/Father's Day Celebration.HEIC",     out: 'rainbow-preschool-fathers-day-celebration-activity.webp',  heic: true },
  { src: 'Activities/Make you own sandwich.jpg',         out: 'rainbow-preschool-make-your-own-sandwich-activity.webp' },
  { src: 'Activities/Play Date With Mothers.jpg',        out: 'rainbow-preschool-play-date-with-mothers-activity.webp' },
  { src: 'Activities/Sleep Time Setup.jpeg',             out: 'rainbow-preschool-sleep-time-setup-activity.webp' },
  { src: 'Activities/Splashy Fun Day.HEIC',              out: 'rainbow-preschool-splashy-fun-day-activity.webp',          heic: true },
  { src: 'Activities/Tom & Jerry Show.jpeg',             out: 'rainbow-preschool-tom-jerry-show-activity.webp' },
  { src: 'Activities/Under the Sea.jpg',                 out: 'rainbow-preschool-under-the-sea-activity.webp' },

  // Centres in Thane
  { src: 'Centres in Thane/Aggarwal Centre (Manpada).jpeg', out: 'rainbow-preschool-manpada-centre-thane.webp' },
  { src: 'Centres in Thane/Anand Nagar Centre.jpeg',        out: 'rainbow-preschool-anand-nagar-centre-thane.webp' },
  { src: 'Centres in Thane/Dhokali Centre.jpeg',            out: 'rainbow-preschool-dhokali-centre-thane.webp' },
  { src: 'Centres in Thane/Hariniwas Centre.jpeg',          out: 'rainbow-preschool-hariniwas-centre-thane.webp' },
  { src: 'Centres in Thane/Kalwa Centre.jpeg',              out: 'rainbow-preschool-kalwa-centre-thane.webp' },
  { src: 'Centres in Thane/Kasarvadavali Centre.jpeg',      out: 'rainbow-preschool-kasarvadavali-centre-thane.webp' },

  // Classroom
  { src: 'Classroom/2 (1).jpg',               out: 'rainbow-preschool-classroom-learning-01.webp' },
  { src: 'Classroom/4 (2).jpg',               out: 'rainbow-preschool-classroom-learning-02.webp' },
  { src: 'Classroom/10.jpg',                  out: 'rainbow-preschool-classroom-learning-03.webp' },
  { src: 'Classroom/16 (1).jpg',              out: 'rainbow-preschool-classroom-learning-04.webp' },
  { src: 'Classroom/Copy of DSC_6496.jpg',    out: 'rainbow-preschool-classroom-activity-01.webp' },
  { src: 'Classroom/Copy of DSC_6550.jpg',    out: 'rainbow-preschool-classroom-activity-02.webp' },
  { src: 'Classroom/Copy of DSC_6574.jpg',    out: 'rainbow-preschool-classroom-activity-03.webp' },
  { src: 'Classroom/Copy of DSC_6575.jpg',    out: 'rainbow-preschool-classroom-activity-04.webp' },

  // Events & Celebrations
  { src: 'Events & Celebrations/2.png',                        out: 'rainbow-preschool-annual-celebration-event-01.webp' },
  { src: 'Events & Celebrations/3.png',                        out: 'rainbow-preschool-annual-celebration-event-02.webp' },
  { src: 'Events & Celebrations/4.png',                        out: 'rainbow-preschool-annual-celebration-event-03.webp' },
  { src: 'Events & Celebrations/Diwali Celebration.jpg',       out: 'rainbow-preschool-diwali-celebration-event.webp' },
  { src: 'Events & Celebrations/Eid Celebration.jpg',          out: 'rainbow-preschool-eid-celebration-event.webp' },
  { src: 'Events & Celebrations/Field Trip to Fire Station.JPG', out: 'rainbow-preschool-field-trip-fire-station-event.webp' },
  { src: 'Events & Celebrations/Ganesh Chaturthi.jpg',         out: 'rainbow-preschool-ganesh-chaturthi-celebration.webp' },
  { src: 'Events & Celebrations/Sports-Day-1.jpg',             out: 'rainbow-preschool-sports-day-event-01.webp' },
  { src: 'Events & Celebrations/Sports-Day-2.jpg',             out: 'rainbow-preschool-sports-day-event-02.webp' },

  // Happy Times
  { src: 'Happy Times/52.jpg', out: 'rainbow-preschool-happy-times-01.webp' },
  { src: 'Happy Times/55.jpg', out: 'rainbow-preschool-happy-times-02.webp' },
  { src: 'Happy Times/57.jpg', out: 'rainbow-preschool-happy-times-03.webp' },
  { src: 'Happy Times/58.jpg', out: 'rainbow-preschool-happy-times-04.webp' },

  // Infrastructure
  { src: 'Infrastructure/Activity Room-1.jpg',     out: 'rainbow-preschool-activity-room-01.webp' },
  { src: 'Infrastructure/Activity Room-2.jpg',     out: 'rainbow-preschool-activity-room-02.webp' },
  { src: 'Infrastructure/Activity Room.jpg',       out: 'rainbow-preschool-activity-room-03.webp' },
  { src: 'Infrastructure/Admin Office.jpg',        out: 'rainbow-preschool-admin-office.webp' },
  { src: 'Infrastructure/Computer Lab.jpg',        out: 'rainbow-preschool-computer-lab.webp' },
  { src: 'Infrastructure/Corridor.jpg',            out: 'rainbow-preschool-corridor.webp' },
  { src: 'Infrastructure/Entrance Area.jpg',       out: 'rainbow-preschool-entrance-area.webp' },
  { src: 'Infrastructure/Library-1.jpg',           out: 'rainbow-preschool-library-01.webp' },
  { src: 'Infrastructure/Library-2.png',           out: 'rainbow-preschool-library-02.webp' },
  { src: 'Infrastructure/Outdoor Premises-1.jpg',  out: 'rainbow-preschool-outdoor-premises-01.webp' },
  { src: 'Infrastructure/Outdoor Premises-2.jpg',  out: 'rainbow-preschool-outdoor-premises-02.webp' },
  { src: 'Infrastructure/Outdoor Premises-3.jpg',  out: 'rainbow-preschool-outdoor-premises-03.webp' },
  { src: 'Infrastructure/Outdoor Premises.jpg',    out: 'rainbow-preschool-outdoor-premises-04.webp' },
  { src: 'Infrastructure/School Essentials.jpg',   out: 'rainbow-preschool-school-essentials.webp' },
];

let ok = 0, failed = 0;

for (const { src, out, heic } of IMAGE_MAP) {
  const srcPath = path.join(SRC, src);
  const destPath = path.join(DEST, out);

  if (!fs.existsSync(srcPath)) {
    console.warn(`⚠️  Missing: ${src}`);
    failed++;
    continue;
  }

  try {
    if (heic) {
      // Use ImageMagick for HEIC/HEIF
      const tmpPath = destPath.replace('.webp', '_tmp.jpg');
      execSync(`convert "${srcPath}" -resize "900>" -quality 85 "${tmpPath}"`, { stdio: 'pipe' });
      await sharp(tmpPath).webp({ quality: 75 }).toFile(destPath);
      fs.unlinkSync(tmpPath);
    } else {
      await sharp(srcPath)
        .resize({ width: 900, withoutEnlargement: true })
        .webp({ quality: 75 })
        .toFile(destPath);
    }
    console.log(`✅ ${out}`);
    ok++;
  } catch (e) {
    console.error(`❌ ${src}: ${e.message}`);
    failed++;
  }
}

console.log(`\nDone: ${ok} OK, ${failed} failed`);
