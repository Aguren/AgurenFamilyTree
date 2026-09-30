window.FAMILY_TREE = {
  people: {
    isaB: {
      name: "Isa Balkov",
      sex: "m",
      relation: "paternal_grandfather"
    },
    djumile: {
      name: "Djumile Balkova",
      sex: "f",
      relation: "paternal_grandmother"
    },
    hasan: {
      name: "Assan / Hasan Balkov",
      sex: "m",
      relation: "father",
      alt: "Hasan Isa / Isaev Byalkov"
    },
    atidje: {
      name: "Atidje Balkova",
      sex: "f",
      relation: "mother",
      alt: "Communist-era name: Delka Nikolova"
    },
    osmanB: {
      name: "Osman",
      sex: "m",
      relation: "fathers_brother",
      alt: "Akgül branch in Turkey"
    },
    fatma: {
      name: "Fatma Akgül",
      sex: "f",
      relation: "fathers_sister",
      birth: "1954",
      alt: "Born in Dolno Izvorovo"
    },
    aguren: {
      name: "Aguren Balkov",
      sex: "m",
      relation: "son",
      alt: "Communist-era name: Eugeni Nikolov"
    },
    courtney: {
      name: "Courtney Witherspoon-Balkov",
      sex: "f",
      relation: "agurens_wife"
    },
    athen: {
      name: "Athen Balkov",
      sex: "m",
      relation: "agurens_son"
    },
    aiferP: {
      name: "Aifer Pendeva",
      sex: "f",
      relation: "daughter",
      alt: "Formerly Aifer Balkova • Communist-era name: Asia Nikolova"
    },
    choukri: {
      name: "Choukri Pendev",
      sex: "m",
      relation: "aifers_husband"
    },
    amira: {
      name: "Amira Pendeva",
      sex: "f",
      relation: "aifers_daughter"
    },
    aydin: {
      name: "Aydin Pendev",
      sex: "m",
      relation: "aifers_son"
    },
    cemile: {
      name: "Cemile Akgul Mutlu",
      sex: "f",
      relation: "osmans_daughter"
    },
    yildiz: {
      name: "Yildiz Akgul Mutlu",
      sex: "f",
      relation: "osmans_daughter"
    },
    selvet: {
      name: "Selvet Akgul Bilir",
      sex: "f",
      relation: "fatmas_daughter"
    },
    elfide: {
      name: "Elfide Akgul",
      sex: "f",
      relation: "fatmas_daughter"
    },

    osmanZ: {
      name: "Osman Zerzil",
      sex: "m",
      relation: "maternal_grandfather"
    },
    mehrema: {
      name: "Mehrema Zerzil",
      sex: "f",
      relation: "maternal_grandmother"
    },
    isaZ: {
      name: "Isa",
      sex: "m",
      relation: "mothers_brother",
      deceased: true,
      alt: "Father of Aifer and Osman"
    },
    zida: {
      name: "Zida",
      sex: "f",
      relation: "mothers_sister",
      alt: "Mother of Mustafa and Ahmed"
    },
    durda: {
      name: "Durda",
      sex: "f",
      relation: "mothers_sister",
      alt: "No children"
    },
    aiferC: {
      name: "Aifer",
      sex: "f",
      relation: "isas_daughter"
    },
    osmanC: {
      name: "Osman",
      sex: "m",
      relation: "isas_son"
    },
    mustafa: {
      name: "Mustafa Sadukov",
      sex: "m",
      relation: "zidas_son"
    },
    ahmed: {
      name: "Ahmed Sadakov",
      sex: "m",
      relation: "zidas_son"
    }
  },

  paternal: {
    title: "Balkov / Byalkov / Akgül",
    root: {
      people: ["isaB", "djumile"],
      children: [
        {
          people: ["hasan", "atidje"],
          children: [
            {
              people: ["aguren", "courtney"],
              children: [
                { people: ["athen"] }
              ]
            },
            {
              people: ["aiferP", "choukri"],
              children: [
                { people: ["amira"] },
                { people: ["aydin"] }
              ]
            }
          ]
        },
        {
          people: ["osmanB"],
          children: [
            { people: ["cemile"] },
            { people: ["yildiz"] }
          ]
        },
        {
          people: ["fatma"],
          children: [
            { people: ["selvet"] },
            { people: ["elfide"] }
          ]
        }
      ]
    }
  },

  maternal: {
    title: "Zerzil",
    root: {
      people: ["osmanZ", "mehrema"],
      children: [
        {
          people: ["atidje"],
          children: [
            {
              people: ["aguren", "courtney"],
              children: [
                { people: ["athen"] }
              ]
            },
            { people: ["aiferP"] }
          ]
        },
        {
          people: ["isaZ"],
          children: [
            { people: ["aiferC"] },
            { people: ["osmanC"] }
          ]
        },
        {
          people: ["zida"],
          children: [
            { people: ["mustafa"] },
            { people: ["ahmed"] }
          ]
        },
        {
          people: ["durda"]
        }
      ]
    }
  }
};
