// Starter PageConfig for a new romantic countdown page.
export function blankConfig() {
  return {
    meta: {
      slug: "",
      locale: "en",
      occasion: "romantic",
      status: "draft",
      plan: "free",
    },
    theme: {
      preset: "sunset",
      accent: "#FF9E9E",
      fontPair: "bricolage-nunito",
      heroStyle: "boardingPass",
      motion: true,
    },
    people: {
      away: [{ name: "" }],
      home: [{ name: "" }],
      whoIsAway: "away",
    },
    hero: {
      title: "The long way\nback to you",
      subtitle: "Where I am right now, and exactly how long until I'm home.",
    },
    target: {
      at: "",
      tz: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
      placeName: "",
      label: "",
      dateLabel: "",
      onZero: {
        title: "home",
        body: "the trip was pointed here the whole time",
        confetti: true,
      },
    },
    entries: [
      {
        id: "entry-0",
        dateStart: "",
        title: "",
        subtitle: "",
        icon: "🧳",
        kind: "stay",
        body: "",
      },
    ],
    note: { body: "" },
    stats: { show: ["stopsLeft", "percent"] },
    share: { ogAuto: true },
    branding: { showFooter: true },
  };
}
