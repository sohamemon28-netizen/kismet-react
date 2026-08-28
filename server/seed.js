import fs from "node:fs/promises";
import path from "node:path";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";

dotenv.config();

/*
 * Put this file in your Kismet server folder, replacing server/seed.js.
 * It copies (never moves or deletes) the already-categorised source images
 * into the React public folder, then replaces every non-Kismet product.
 */
const DOWNLOADS = "C:/Users/soham/Downloads";
const PUBLIC_PRODUCTS = path.resolve("../public/images/products");
const KEEP_TITLES = (process.env.KISMET_KEEP_TITLES ||
    "Celestial Pearl Necklace,Golden Hour Earrings,Luna Charm Bracelet,Eternal Bloom Ring")
    .split(",")
    .map(title => title.trim())
    .filter(Boolean);

const product = (folder, file, category, title, description, price) => ({
    folder, file, category, title, description, price
});

// Descriptions only state visible details from the supplied image.
const catalogue = [
    product("necklaces", "nec 1.jpeg", "Pendants", "Sanctum Cross Pendant", "A fine gold-tone chain with a small round cross medallion.", 48),
    product("necklaces", "nec 2.jpeg", "Pendants", "Aurelia Rose Pendant", "An oval gold-tone pendant embossed with a single rose.", 56),
    product("necklaces", "nec 3.jpeg", "Pendants", "Solstice Medallion Pendant", "A round pendant centred with a sunburst motif on a link chain.", 54),
    product("necklaces", "nec 4.jpeg", "Pendants", "North Star Pendant", "A small eight-point star pendant suspended from a twisted gold-tone chain.", 44),
    product("necklaces", "nec 5.jpeg", "Pendants", "Daybreak Celestial Pendant", "A large round pendant with raised sun, moon and star details.", 62),
    product("necklaces", "nec 6.jpeg", "Pendants", "Rosette Stone Pendant", "A textured round gold-tone pendant set with a soft pink oval stone.", 58),
    product("necklaces", "nec 7.jpeg", "Pendants", "Solis Eye Pendant", "A delicate eye-shaped pendant framed with small clear stones.", 46),
    product("necklaces", "nec 8.jpeg", "Pendants", "Tidal Fish Pendant", "A sculpted gold-tone fish pendant on a fine chain.", 45),
    product("necklaces", "nec 10.jpeg", "Pendants", "Compass Light Pendant", "A compass-inspired round gold-tone pendant with raised directional points.", 52),
    product("necklaces", "nec 11.jpeg", "Pendants", "Luna Layered Pendant", "Two layered chains with moon-and-sun inspired round pendants.", 68),
    product("necklaces", "nec 12.jpeg", "Pendants", "Ankh Emblem Pendant", "A small polished ankh pendant on a fine gold-tone chain.", 47),
    product("necklaces", "nec 13.jpeg", "Pendants", "Starlit Tag Pendant", "A rounded rectangular tag pendant marked by a single star detail.", 50),
    product("necklaces", "nec 15.jpeg", "Pendants", "Heirloom Heart Locket", "A gold-tone heart-shaped locket pendant with an engraved floral border.", 72),
    product("necklaces", "nec 9.jpeg", "Necklaces", "Orbit Link Necklace", "A gold-tone link necklace finished with a circular front clasp.", 55),
    product("necklaces", "nec 14.jpeg", "Necklaces", "Aster Lariat Necklace", "A snake-chain lariat necklace with a central clear stone and tapered drop.", 64),

    product("bracelets", "brace 1.jpeg", "Bracelets", "Laurel Coin Bracelet", "A gold-tone chain bracelet centred with a framed coin-style medallion.", 58),
    product("bracelets", "brace 2.jpeg", "Bracelets", "Bamboo Cuff Bracelet", "A slim open cuff shaped in smooth bamboo-like sections.", 46),
    product("bracelets", "brace 3.jpeg", "Bracelets", "Petal Charm Bracelet", "A charm bracelet with pink beads, a butterfly accent and a small heart drop.", 62),
    product("bracelets", "brace 4.jpeg", "Bracelets", "Prism Link Bracelet", "A fine bracelet with alternating pastel and deep-blue stone settings.", 66),
    product("bracelets", "brace 5.jpeg", "Bracelets", "Bloom Enamel Bangle Set", "A stacked set of pastel enamel bangles with raised floral details.", 70),
    product("bracelets", "brace 6.jpeg", "Bracelets", "Daisy Chain Bracelet", "A double-chain bracelet with bead links, clear-stone flowers and a round drop.", 61),
    product("bracelets", "brace 7.jpeg", "Bracelets", "Celestial Cuff Stack", "A stack of gold-tone cuffs featuring celestial engraving and coloured stone accents.", 75),
    product("bracelets", "brace 8.jpeg", "Bracelets", "Rose Prism Bracelet", "A linked bracelet set with alternating pink stones in multiple cuts.", 69),
    product("bracelets", "brace 9.jpeg", "Bracelets", "Starline Bracelet", "A fine gold-tone bracelet with a central starburst and disc-link details.", 49),
    product("bracelets", "brace 10.jpeg", "Bracelets", "Sealed Letter Charm Bracelet", "A snake-chain bracelet with bead charms and a small envelope charm.", 64),

    product("charms", "charm 1.jpeg", "Charms", "Mythic Medallion Charm Set", "A selection of round mixed-metal charms with celestial, animal and rose reliefs.", 36),
    product("charms", "charm 2.jpeg", "Charms", "Sagittarius Medallion Charm Set", "A selection of embossed gold-tone medallion charms with animal and arrow motifs.", 36),
    product("charms", "charm 3.jpeg", "Charms", "Golden Symbol Charm Assortment", "A mixed charm selection featuring stars, moons, crosses, hands and rainbow motifs.", 32),
    product("charms", "charm 4.jpeg", "Charms", "Wanderlust Charm Assortment", "A mixed charm selection with palm, anchor, fish, eye, moon and cross motifs.", 34),
    product("charms", "charm 5.jpeg", "Charms", "Lucky Token Charm Assortment", "A mixed charm selection featuring clovers, lockets, crosses, hearts and protective-eye motifs.", 35),

    product("earrings", "earring 1.jpeg", "Earrings", "Lunar Disc Hoops", "Gold-tone hoops with round discs engraved with sun, moon and star motifs.", 49),
    product("earrings", "earring 2.jpeg", "Earrings", "Blush Heart Hoops", "Pink enamel hoop earrings with polished heart drops.", 44),
    product("earrings", "earring 3.jpeg", "Earrings", "Auric Crystal Drops", "Gold-tone drop earrings with clear oval stones in sculptural settings.", 58),
    product("earrings", "earring 4.jpeg", "Earrings", "Butterfly Bow Studs", "Small gold-tone bow-and-butterfly shaped studs.", 39),
    product("earrings", "earring 5.jpeg", "Earrings", "Sculpted Heart Hoops", "Polished gold-tone hoops with dimensional heart drops.", 45),
    product("earrings", "earring 6.jpeg", "Earrings", "Garnet Heart Links", "Long gold-tone links finished with deep red heart charms.", 48),
    product("earrings", "earring 7.jpeg", "Earrings", "Seafarer Coin Drops", "Round gold-tone drops with an embossed seafaring scene.", 52),
    product("earrings", "earring 8.jpeg", "Earrings", "Golden Shell Studs", "Ridged gold-tone shell-shaped stud earrings.", 43),
    product("earrings", "earring 9.jpeg", "Earrings", "Crystal Butterfly Hoops", "Small gold-tone hoops wrapped with clear butterfly-shaped stones.", 55),

    product("rings", "ring 1.jpeg", "Rings", "Blush Pear Ring", "A gold-tone ring with a pale pink pear-shaped centre stone and clear side stones.", 62),
    product("rings", "ring 2.jpeg", "Rings", "Rose Rectangle Ring", "A slim gold-tone ring set with a rectangular pink stone.", 52),
    product("rings", "ring 3.jpeg", "Rings", "Aurora Ribbon Ring", "A wide sculptural gold-tone ring with ribbon-like bands and clear stones.", 66),
    product("rings", "ring 4.jpeg", "Rings", "Starlight Signet Ring", "A set of slim signet-style rings with small coloured star details.", 48),
    product("rings", "ring 5.jpeg", "Rings", "Safety Pin Pavé Ring", "A gold-tone ring shaped with a safety-pin detail and clear stone bands.", 64),
    product("rings", "ring 6.jpeg", "Rings", "Marquise Halo Ring", "A slim ring centred by a clear marquise-cut stone.", 57),
    product("rings", "ring 7.jpeg", "Rings", "Crystal Crown Ring", "An open gold-tone ring topped with a row of mixed clear stones.", 61),
    product("rings", "ring 8.jpeg", "Rings", "Cowboys & Tequila Ring", "A silver-tone wrap ring engraved with the words Cowboys & Tequila.", 41),
    product("rings", "ring 9.jpeg", "Rings", "Gemstone Cluster Ring Set", "A mixed-metal ring set featuring clustered clear marquise stones.", 59),
    product("rings", "ring 10.jpeg", "Rings", "Compass Signet Ring", "A gold-tone signet ring with an engraved compass-style face.", 54),
    product("rings", "ring 11.jpeg", "Rings", "Crystal Orbit Ring", "A coiled gold-tone ring with multiple clear-stone bands.", 65),
    product("rings", "ring 12.jpeg", "Rings", "Petal Stone Ring", "A gold-tone ring with a flower-like setting around a pale pink centre stone.", 60),
    product("rings", "ring 13.jpeg", "Rings", "North Star Cuff Ring", "An open wide ring engraved with a large central star and smaller stars.", 55),
    product("rings", "ring 14.jpeg", "Rings", "Marquise Cluster Ring", "A gold-tone cluster ring with several clear marquise-shaped stones.", 63),
    product("rings", "ring 15.jpeg", "Rings", "Eternal Crystal Stack Ring", "A layered gold-tone ring with two clear-stone bands and round link details.", 68),

    product("watch", "watch 1.jpeg", "Watches", "Aurelia Square Watch", "A gold-tone watch with a softly squared dial, plain markers and a slim bangle strap.", 89),
    product("watch", "watch 2.jpeg", "Watches", "Chainlink Oval Watch", "An oval gold-tone watch with a bold polished chain-link bracelet.", 96),
    product("watch", "watch 3.jpeg", "Watches", "Heritage Roman Watch", "An oval watch with Roman numerals and a brown textured strap.", 82),
    product("watch", "watch 4.jpeg", "Watches", "Regency Bangle Watch", "A round gold-tone bangle watch with Roman numeral markers.", 92)
];

async function copyImages() {
    for (const item of catalogue) {
        const source = path.join(DOWNLOADS, item.folder, item.file);
        const targetDirectory = path.join(PUBLIC_PRODUCTS, item.category.toLowerCase());
        const target = path.join(targetDirectory, item.file);
        await fs.mkdir(targetDirectory, { recursive: true });
        try {
            await fs.access(target);
        } catch {
            await fs.copyFile(source, target);
        }
        item.image = `/images/products/${item.category.toLowerCase()}/${item.file}`;
        delete item.folder;
        delete item.file;
    }
}

async function seedDatabase() {
    await mongoose.connect(process.env.MONGO_URI);
    try {
        await copyImages();
        const protectedProducts = await Product.find({ title: { $in: KEEP_TITLES } }).lean();
        if (protectedProducts.length !== 4) {
            throw new Error(`Expected to preserve 4 Kismet products, but found ${protectedProducts.length}. Update KISMET_KEEP_TITLES before retrying.`);
        }
        await Product.deleteMany({ _id: { $nin: protectedProducts.map(item => item._id) } });
        await Product.insertMany(catalogue);
        console.log(`Kept 4 Kismet products and added ${catalogue.length} image-backed products.`);
    } finally {
        await mongoose.disconnect();
    }
}

seedDatabase().catch(error => {
    console.error("Catalogue seed failed:", error.message);
    process.exitCode = 1;
});
