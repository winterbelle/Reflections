import React from "react";
import "./Filter.css";
//Possible future filters
const FILTERS = {
  age: [
    "Newborn",
    "Infant",
    "Toddler",
    "Preschool",
    "School Age",
    "Teen"
  ],
  topic: [
    "Sleep",
    "Nutrition",
    "Behavior",
    "Education",
    "Health",
    "Mental Health"
  ],
  type: [
    "Question",
    "Advice",
    "Discussion",
    "Success Story"
  ]
};

function Filter() {
    return (
        <div className="filter-container">
            <h2>Filter by:</h2>
            <div className="filter-options">

                <div className="filter-section">
                    <h3>Age</h3>

                    {FILTERS.age.map((age) => (
                    <label key={age}>
                        <input
                        type="checkbox"
                        />
                        {age}
                    </label>
                    ))}
                </div>

                <div className="filter-section">
                    <h3>Topic</h3>

                    {FILTERS.topic.map((topic) => (
                    <label key={topic}>
                        <input
                        type="checkbox"
                        />
                        {topic}
                    </label>
                    ))}
                </div>

                <div className="filter-section">
                    <h3>Post Type</h3>

                    {FILTERS.type.map((type) => (
                    <label key={type}>
                        <input
                        type="checkbox"
                        />
                        {type}
                    </label>
                    ))}
                </div>
                
            </div>
        </div>

    );

}

export default Filter;