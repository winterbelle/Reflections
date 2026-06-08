import "./Resources.css";

const resources = [
  {
    category: "Crisis & Mental Health",
    items: [
      {
        title: "988 Suicide & Crisis Lifeline",
        description: "24/7 confidential support for emotional distress and crisis situations.",
        link: "https://988lifeline.org",
        contact: "Call or Text 988",
      },
      {
        title: "NAMI HelpLine",
        description: "Mental health support, education, and referrals.",
        link: "https://nami.org/help",
        contact: "(800) 950-6264",
      },
      {
        title: "SAMHSA National Helpline",
        description: "Support for mental health and substance use concerns.",
        link: "https://www.samhsa.gov/find-help/national-helpline",
        contact: "1-800-662-4357",
      },
    ],
  },
  {
    category: "Parent & Family Resources",
    items: [
      {
        title: "Postpartum Support International",
        description: "Resources for postpartum depression, anxiety, and support groups.",
        link: "https://www.postpartum.net",
      },
      {
        title: "HealthyChildren.org",
        description: "Trusted parenting information from pediatric experts.",
        link: "https://www.healthychildren.org",
      },
      {
        title: "Zero to Three",
        description: "Resources for infant and toddler development.",
        link: "https://www.zerotothree.org",
      },
    ],
  },
  {
    category: "Safety & Support",
    items: [
      {
        title: "National Domestic Violence Hotline",
        description: "24/7 confidential support and resources.",
        link: "https://www.thehotline.org",
        contact: "(800) 799-7233",
      },
      {
        title: "RAINN Sexual Assault Hotline",
        description: "Confidential support for survivors of sexual assault.",
        link: "https://www.rainn.org",
        contact: "(800) 656-4673",
      },
    ],
  },
];
const Resources = () => {
  return (
    <div className="resources-page">
      <div className="resources-header">
        <h1>Helpful Resources</h1>

        <p>
          Support is always available. Explore trusted organizations,
          crisis resources, parenting support, and wellness tools.
        </p>
      </div>

      <div className="resources-grid">
        {resources.map((section) => (
          <div
            key={section.category}
            className="resource-section"
          >
            <h2>{section.category}</h2>

            {section.items.map((resource) => (
              <div
                key={resource.title}
                className="resource-card"
              >
                <h3>{resource.title}</h3>

                <p>{resource.description}</p>

                {resource.contact && (
                  <span className="resource-contact">
                    {resource.contact}
                  </span>
                )}

                <a
                  href={resource.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit Resource →
                </a>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="emergency-banner">
        <strong>Emergency:</strong> If you or someone else is in immediate
        danger, call 911 or your local emergency services.
      </div>
    </div>
  );
};

export default Resources;