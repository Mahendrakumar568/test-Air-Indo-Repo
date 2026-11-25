import type { Locale } from "./i18n";
import type { CityCode } from "./data";

/**
 * The rooted side of every destination: one local craft, one dish, a word to say,
 * and three places worth the trip. Photos are optional and fall back to a craft pattern.
 */
export type Motif = "ikat" | "dots" | "lattice" | "waves";

type Place = { name: string; line: string };
export type CityCulture = {
  craft: { name: string; line: string; also: string };
  food: { name: string; line: string };
  word: { script: string; roman: string; meaning: string };
  places: [Place, Place, Place];
};

/** Distance in km from the city, 0 meaning inside the city. Index matches `places`. */
export const placeKm: Record<CityCode, [number, number, number]> = {
  VTZ: [115, 0, 25],
  VGA: [8, 0, 35],
  HYD: [10, 0, 11],
  GOI: [25, 30, 60],
  BHO: [46, 45, 0],
  PNQ: [35, 0, 65],
};

export const motifOf: Record<CityCode, Motif> = { VTZ: "waves", VGA: "dots", HYD: "ikat", GOI: "lattice", BHO: "dots", PNQ: "ikat" };

export const cultureLabels: Record<Locale, {
  kicker: string; title: string; craft: string; food: string; word: string; nearby: string;
  inCity: string; km: string; fly: string; notify: string; skip: string;
}> = {
  en: {
    kicker: "Rooted in {city}", title: "Made, cooked and loved here.", craft: "Local craft", food: "On the plate",
    word: "Say it like a local", nearby: "Worth the trip", inCity: "In the city", km: "km away",
    fly: "Fly from {city}", notify: "Tell me when {city} opens", skip: "Skip intro",
  },
  te: {
    kicker: "{city} ప్రత్యేకతలు", title: "ఇక్కడి కళ, ఇక్కడి రుచి, ఇక్కడి ప్రదేశాలు.", craft: "స్థానిక కళ", food: "తప్పక రుచి చూడండి",
    word: "స్థానికుల్లా పలకరించండి", nearby: "చూడదగ్గ ప్రదేశాలు", inCity: "నగరంలోనే", km: "కి.మీ. దూరం",
    fly: "{city} నుంచి ప్రయాణం", notify: "{city} బుకింగ్ తెరిచినప్పుడు తెలియజేయండి", skip: "ఇంట్రో దాటవేయండి",
  },
  hi: {
    kicker: "{city} की पहचान", title: "यहाँ की कला, यहाँ का स्वाद, यहाँ की जगहें।", craft: "स्थानीय कला", food: "थाली में",
    word: "स्थानीय अंदाज़ में कहें", nearby: "घूमने लायक", inCity: "शहर में ही", km: "कि.मी. दूर",
    fly: "{city} से उड़ान", notify: "{city} की बुकिंग खुलने पर बताएँ", skip: "इंट्रो छोड़ें",
  },
};

export const culture: Record<Locale, Record<CityCode, CityCulture>> = {
  en: {
    VTZ: {
      craft: { name: "Etikoppaka toys", line: "Lacquered wooden toys turned on a lathe and coloured with dyes made from seeds, bark and lac.", also: "GI-tagged · Etikoppaka village, 60 km away" },
      food: { name: "Bongulo chicken", line: "Chicken sealed inside bamboo and slow-cooked over coals, the way it is made in the Araku hills." },
      word: { script: "నమస్కారం", roman: "Namaskaram", meaning: "Hello, said with respect" },
      places: [
        { name: "Araku Valley", line: "Coffee estates in the clouds, with the Borra Caves on the way up." },
        { name: "Kailasagiri", line: "A hilltop park with the whole bay below you." },
        { name: "Bheemunipatnam", line: "A quiet Dutch-era beach town where the Gosthani meets the sea." },
      ],
    },
    VGA: {
      craft: { name: "Kondapalli toys", line: "Soft tella poniki wood, carved and hand-painted into dancing dolls, elephants and whole village scenes.", also: "GI-tagged · Kondapalli village, 20 km away" },
      food: { name: "Andhra bhojanam", line: "Rice, pappu, ghee and fiery gongura pachadi on a banana leaf. Come hungry." },
      word: { script: "బాగున్నారా?", roman: "Baagunnaaraa?", meaning: "How are you?" },
      places: [
        { name: "Undavalli Caves", line: "Rock-cut caves from the 4th to 7th century, with a giant reclining Vishnu." },
        { name: "Kanaka Durga Temple", line: "On Indrakeeladri hill, looking over the Krishna." },
        { name: "Amaravati", line: "The ancient Buddhist stupa site at the heart of the new capital region." },
      ],
    },
    HYD: {
      craft: { name: "Pochampally ikat", line: "Threads tie-dyed before weaving, so the geometric patterns appear as the loom moves.", also: "GI-tagged · Bhoodan Pochampally, 45 km away" },
      food: { name: "Dum biryani", line: "Slow-cooked under a sealed lid, then Irani chai and Osmania biscuits to finish." },
      word: { script: "آداب", roman: "Aadaab", meaning: "A courteous hello from the city of the Nizams" },
      places: [
        { name: "Qutb Shahi Tombs", line: "The domed tombs of the Golconda kings, beautifully restored." },
        { name: "Charminar and Laad Bazaar", line: "Bangles, pearls and attar in the lanes around the 1591 monument." },
        { name: "Golconda Fort", line: "Climb to the top for the view, stay for the sound and light show." },
      ],
    },
    GOI: {
      craft: { name: "Kaavi art", line: "Lime-white line drawings etched into red laterite on old Konkan temples, now being revived by Goan artists.", also: "Also look for Bicholim terracotta" },
      food: { name: "Xitt kodi", line: "Rice with coconut fish curry, the everyday Goan lunch. Bebinca after." },
      word: { script: "देव बरें करूं", roman: "Dev borem korum", meaning: "Thank you, in Konkani" },
      places: [
        { name: "Fontainhas", line: "Panaji's Latin quarter of painted houses, tiled lanes and bakeries." },
        { name: "Old Goa", line: "Bom Jesus and the Se Cathedral, a UNESCO World Heritage site." },
        { name: "Dudhsagar Falls", line: "A four-tier waterfall on the Western Ghats, at its best after the monsoon." },
      ],
    },
    BHO: {
      craft: { name: "Gond painting", line: "Dense dots and dashes that bring forests, animals and myths to life, painted by Gond artists, many of whom live in Bhopal.", also: "See it at the Tribal Museum · Also: zardozi batuas" },
      food: { name: "Poha and jalebi", line: "The Bhopali breakfast. By night, kebabs and korma in the old city." },
      word: { script: "राम राम", roman: "Raam Raam", meaning: "The everyday hello across Madhya Pradesh" },
      places: [
        { name: "Sanchi Stupa", line: "The Great Stupa from the 3rd century BCE, a UNESCO World Heritage site." },
        { name: "Bhimbetka", line: "Rock shelters with paintings more than 10,000 years old." },
        { name: "Upper Lake", line: "Sunset on the 11th-century Bhojtal, the lake the city grew around." },
      ],
    },
    PNQ: {
      craft: { name: "Paithani silk", line: "Silk sarees with gold zari borders and peacock pallus, woven by hand the same way for centuries.", also: "Also: the Puneri pagadi" },
      food: { name: "Misal pav", line: "Sprouted moth curry under a spicy tarri, farsan for crunch and soft pav. Pune takes it seriously." },
      word: { script: "काय म्हणता?", roman: "Kaay mhanta?", meaning: "Marathi for \"how's it going?\"" },
      places: [
        { name: "Sinhagad Fort", line: "A Maratha hill fort, best on a monsoon morning with pithla bhakri at the top." },
        { name: "Shaniwar Wada", line: "The 1732 Peshwa palace at the heart of the old peths." },
        { name: "Lonavala", line: "Ghats, waterfalls and chikki, an easy drive away." },
      ],
    },
  },
  te: {
    VTZ: {
      craft: { name: "ఏటికొప్పాక బొమ్మలు", line: "లేత్‌పై మలిచి, గింజలు, బెరడు, లక్కతో చేసిన సహజ రంగులు అద్దిన చెక్క బొమ్మలు.", also: "జీఐ ట్యాగ్ · ఏటికొప్పాక గ్రామం, 60 కి.మీ." },
      food: { name: "బొంగులో చికెన్", line: "వెదురు బొంగులో పెట్టి నిప్పుల మీద నెమ్మదిగా ఉడికించే అరకు ప్రత్యేక వంటకం." },
      word: { script: "నమస్కారం", roman: "Namaskaram", meaning: "గౌరవంగా పలకరింపు" },
      places: [
        { name: "అరకు లోయ", line: "మబ్బుల్లో కాఫీ తోటలు, దారిలో బొర్రా గుహలు." },
        { name: "కైలాసగిరి", line: "కింద విశాలమైన సముద్ర తీరం కనిపించే కొండపై పార్క్." },
        { name: "భీమునిపట్నం", line: "గోస్తనీ నది సముద్రంలో కలిసే ప్రశాంతమైన డచ్ కాలపు తీర పట్టణం." },
      ],
    },
    VGA: {
      craft: { name: "కొండపల్లి బొమ్మలు", line: "తెల్ల పొనికి చెక్కతో చెక్కి, చేతితో రంగులు వేసిన బొమ్మలు, ఏనుగులు, పల్లె దృశ్యాలు.", also: "జీఐ ట్యాగ్ · కొండపల్లి గ్రామం, 20 కి.మీ." },
      food: { name: "ఆంధ్ర భోజనం", line: "అరిటాకులో అన్నం, పప్పు, నెయ్యి, ఘాటైన గోంగూర పచ్చడి. ఆకలితో రండి." },
      word: { script: "బాగున్నారా?", roman: "Baagunnaaraa?", meaning: "ఎలా ఉన్నారు?" },
      places: [
        { name: "ఉండవల్లి గుహలు", line: "4వ నుంచి 7వ శతాబ్దపు రాతి గుహలు, భారీ శయన విష్ణువు." },
        { name: "కనకదుర్గ ఆలయం", line: "కృష్ణా నదిని చూస్తూ ఇంద్రకీలాద్రిపై." },
        { name: "అమరావతి", line: "కొత్త రాజధాని ప్రాంతం నడిబొడ్డున పురాతన బౌద్ధ స్తూపం." },
      ],
    },
    HYD: {
      craft: { name: "పోచంపల్లి ఇక్కత్", line: "నేయడానికి ముందే దారాలకు రంగులు కట్టడం వల్ల మగ్గం కదిలే కొద్దీ జ్యామితీయ డిజైన్లు కనిపిస్తాయి.", also: "జీఐ ట్యాగ్ · భూదాన్ పోచంపల్లి, 45 కి.మీ." },
      food: { name: "దమ్ బిర్యానీ", line: "మూత బిగించి నెమ్మదిగా ఉడికించిన బిర్యానీ, ఆ తర్వాత ఇరానీ చాయ్, ఉస్మానియా బిస్కెట్లు." },
      word: { script: "آداب", roman: "Aadaab", meaning: "నిజాముల నగరం నుంచి మర్యాదపూర్వక పలకరింపు" },
      places: [
        { name: "కుతుబ్ షాహీ సమాధులు", line: "గోల్కొండ రాజుల గుమ్మటాల సమాధులు, అందంగా పునరుద్ధరించారు." },
        { name: "చార్మినార్, లాడ్ బజార్", line: "1591 నాటి కట్టడం చుట్టూ గాజులు, ముత్యాలు, అత్తరు." },
        { name: "గోల్కొండ కోట", line: "దృశ్యం కోసం పైకి ఎక్కండి, సౌండ్ అండ్ లైట్ షో కోసం ఉండండి." },
      ],
    },
    GOI: {
      craft: { name: "కావి కళ", line: "పాత కొంకణ్ ఆలయాల ఎర్ర లేటరైట్ గోడలపై సున్నపు తెలుపు గీతల చిత్రాలు, ఇప్పుడు గోవా కళాకారులు పునరుద్ధరిస్తున్నారు.", also: "బిచోలిమ్ టెర్రకోటా కూడా చూడండి" },
      food: { name: "షిత్ కోడీ", line: "అన్నం, కొబ్బరి చేపల కూర, గోవా రోజువారీ భోజనం. తర్వాత బెబింకా." },
      word: { script: "देव बरें करूं", roman: "Dev borem korum", meaning: "కొంకణిలో ధన్యవాదాలు" },
      places: [
        { name: "ఫొంటైన్‌హాస్", line: "రంగుల ఇళ్లు, టైల్స్ వీధులు, బేకరీలతో పణజీ లాటిన్ క్వార్టర్." },
        { name: "ఓల్డ్ గోవా", line: "బోమ్ జీసస్, సే కేథడ్రల్, యునెస్కో వారసత్వ ప్రదేశం." },
        { name: "దూధ్‌సాగర్ జలపాతం", line: "పశ్చిమ కనుమల్లో నాలుగు అంచెల జలపాతం, వర్షాకాలం తర్వాత అద్భుతం." },
      ],
    },
    BHO: {
      craft: { name: "గోండ్ చిత్రకళ", line: "అడవులు, జంతువులు, పురాణాలకు ప్రాణం పోసే దట్టమైన చుక్కలు, గీతలు. చాలామంది గోండ్ కళాకారులు భోపాల్‌లోనే ఉంటారు.", also: "ట్రైబల్ మ్యూజియంలో చూడండి · జర్దోజీ బటువాలు కూడా" },
      food: { name: "పోహా, జిలేబీ", line: "భోపాల్ అల్పాహారం. రాత్రి పాత నగరంలో కబాబ్‌లు, కోర్మా." },
      word: { script: "राम राम", roman: "Raam Raam", meaning: "మధ్యప్రదేశ్ అంతటా రోజువారీ పలకరింపు" },
      places: [
        { name: "సాంచీ స్తూపం", line: "క్రీ.పూ. 3వ శతాబ్దపు మహా స్తూపం, యునెస్కో వారసత్వ ప్రదేశం." },
        { name: "భీమ్‌బేట్కా", line: "10,000 ఏళ్లకు పైబడిన చిత్రాలున్న రాతి ఆశ్రయాలు." },
        { name: "అప్పర్ లేక్", line: "నగరం చుట్టూ పెరిగిన 11వ శతాబ్దపు భోజ్‌తాల్‌పై సూర్యాస్తమయం." },
      ],
    },
    PNQ: {
      craft: { name: "పైఠణీ పట్టు", line: "బంగారు జరీ అంచులు, నెమలి పల్లుతో, శతాబ్దాలుగా అదే పద్ధతిలో చేతితో నేసే పట్టు చీరలు.", also: "పుణేరీ పగడీ కూడా" },
      food: { name: "మిసల్ పావ్", line: "మొలకెత్తిన గింజల కూర, ఘాటైన తర్రీ, కరకరలాడే ఫర్సాణ్, మెత్తని పావ్." },
      word: { script: "काय म्हणता?", roman: "Kaay mhanta?", meaning: "మరాఠీలో ఎలా ఉన్నారు?" },
      places: [
        { name: "సింహగడ్ కోట", line: "మరాఠా కొండ కోట, వర్షాకాలపు ఉదయం పిఠ్లా భాకరీతో అద్భుతం." },
        { name: "శనివార్ వాడా", line: "పాత పేఠ్‌ల నడిబొడ్డున 1732 నాటి పీష్వాల రాజభవనం." },
        { name: "లోనావాలా", line: "కనుమలు, జలపాతాలు, చిక్కీ, సులువైన ప్రయాణం." },
      ],
    },
  },
  hi: {
    VTZ: {
      craft: { name: "एटिकोप्पाका खिलौने", line: "खराद पर गढ़े, बीज, छाल और लाख से बने प्राकृतिक रंगों वाले लकड़ी के खिलौने।", also: "जीआई टैग · एटिकोप्पाका गाँव, 60 कि.मी." },
      food: { name: "बोंगुलो चिकन", line: "बाँस में बंद करके अंगारों पर धीरे-धीरे पकाया गया चिकन, अराकू की पहाड़ियों का अंदाज़।" },
      word: { script: "నమస్కారం", roman: "Namaskaram", meaning: "तेलुगु में आदर भरा नमस्ते" },
      places: [
        { name: "अराकू घाटी", line: "बादलों में कॉफ़ी बागान, रास्ते में बोर्रा गुफाएँ।" },
        { name: "कैलासगिरि", line: "पहाड़ी पर पार्क, नीचे पूरी खाड़ी।" },
        { name: "भीमुनिपट्नम", line: "डच दौर का शांत तटीय कस्बा, जहाँ गोस्तनी नदी समुद्र से मिलती है।" },
      ],
    },
    VGA: {
      craft: { name: "कोंडापल्ली खिलौने", line: "नरम तेल्ला पोनिकी लकड़ी से तराशे और हाथ से रंगे गुड्डे, हाथी और पूरे गाँव के दृश्य।", also: "जीआई टैग · कोंडापल्ली गाँव, 20 कि.मी." },
      food: { name: "आंध्र भोजनम", line: "केले के पत्ते पर चावल, पप्पु, घी और तीखी गोंगुरा चटनी। भूख लेकर आइए।" },
      word: { script: "బాగున్నారా?", roman: "Baagunnaaraa?", meaning: "तेलुगु में, आप कैसे हैं?" },
      places: [
        { name: "उंडवल्ली गुफाएँ", line: "चौथी से सातवीं सदी की चट्टानों में कटी गुफाएँ, विशाल शयन विष्णु के साथ।" },
        { name: "कनक दुर्गा मंदिर", line: "इंद्रकीलाद्री पहाड़ी पर, कृष्णा नदी को निहारता।" },
        { name: "अमरावती", line: "नई राजधानी क्षेत्र के बीच प्राचीन बौद्ध स्तूप।" },
      ],
    },
    HYD: {
      craft: { name: "पोचमपल्ली इकत", line: "बुनाई से पहले ही धागों को बाँधकर रंगा जाता है, इसलिए करघा चलते ही ज्यामितीय डिज़ाइन उभरते हैं।", also: "जीआई टैग · भूदान पोचमपल्ली, 45 कि.मी." },
      food: { name: "दम बिरयानी", line: "ढक्कन बंद करके धीमी आँच पर पकी बिरयानी, फिर ईरानी चाय और उस्मानिया बिस्कुट।" },
      word: { script: "آداب", roman: "Aadaab", meaning: "निज़ामों के शहर का तहज़ीब भरा सलाम" },
      places: [
        { name: "क़ुतुब शाही मक़बरे", line: "गोलकोंडा के बादशाहों के गुंबददार मक़बरे, ख़ूबसूरती से सँवारे गए।" },
        { name: "चारमीनार और लाड बाज़ार", line: "1591 की इमारत के आसपास चूड़ियाँ, मोती और इत्र।" },
        { name: "गोलकोंडा क़िला", line: "नज़ारे के लिए ऊपर चढ़ें, लाइट एंड साउंड शो के लिए रुकें।" },
      ],
    },
    GOI: {
      craft: { name: "कावी कला", line: "पुराने कोंकणी मंदिरों की लाल लैटेराइट दीवारों पर चूने की सफ़ेद रेखाएँ, जिन्हें गोवा के कलाकार फिर से जीवित कर रहे हैं।", also: "बिचोलिम की टेराकोटा भी देखें" },
      food: { name: "शित कोडी", line: "चावल और नारियल वाली मछली करी, गोवा का रोज़ का भोजन। फिर बेबिंका।" },
      word: { script: "देव बरें करूं", roman: "Dev borem korum", meaning: "कोंकणी में धन्यवाद" },
      places: [
        { name: "फ़ोंटेनहास", line: "पणजी का लैटिन क्वार्टर, रंगीन घर, टाइलों वाली गलियाँ और बेकरी।" },
        { name: "पुराना गोवा", line: "बॉम जीसस और से कैथेड्रल, यूनेस्को विश्व धरोहर।" },
        { name: "दूधसागर जलप्रपात", line: "पश्चिमी घाट में चार स्तरों वाला झरना, मानसून के बाद सबसे सुंदर।" },
      ],
    },
    BHO: {
      craft: { name: "गोंड चित्रकला", line: "घने बिंदु और रेखाएँ जो जंगल, जानवर और मिथकों को जीवंत करती हैं। कई गोंड कलाकार भोपाल में ही रहते हैं।", also: "जनजातीय संग्रहालय में देखें · ज़रदोज़ी बटुए भी" },
      food: { name: "पोहा-जलेबी", line: "भोपाल का नाश्ता। रात में पुराने शहर के कबाब और कोरमा।" },
      word: { script: "राम राम", roman: "Raam Raam", meaning: "पूरे मध्य प्रदेश का रोज़ का अभिवादन" },
      places: [
        { name: "साँची स्तूप", line: "ईसा पूर्व तीसरी सदी का महान स्तूप, यूनेस्को विश्व धरोहर।" },
        { name: "भीमबेटका", line: "10,000 साल से भी पुराने चित्रों वाले शैलाश्रय।" },
        { name: "बड़ा तालाब", line: "ग्यारहवीं सदी के भोजताल पर सूर्यास्त, जिसके चारों ओर शहर बसा।" },
      ],
    },
    PNQ: {
      craft: { name: "पैठणी सिल्क", line: "सुनहरी ज़री के किनारे और मोर वाले पल्लू, सदियों से उसी तरह हाथ से बुनी रेशमी साड़ियाँ।", also: "पुणेरी पगड़ी भी" },
      food: { name: "मिसल पाव", line: "अंकुरित मोठ की करी, तीखी तर्री, कुरकुरा फरसाण और नरम पाव। पुणे इसे गंभीरता से लेता है।" },
      word: { script: "काय म्हणता?", roman: "Kaay mhanta?", meaning: "मराठी में, क्या हाल है?" },
      places: [
        { name: "सिंहगढ़ क़िला", line: "मराठा पहाड़ी क़िला, मानसून की सुबह ऊपर पिठला भाकरी के साथ।" },
        { name: "शनिवार वाड़ा", line: "पुराने पेठों के बीच 1732 का पेशवा महल।" },
        { name: "लोनावला", line: "घाट, झरने और चिक्की, आसान ड्राइव पर।" },
      ],
    },
  },
};
