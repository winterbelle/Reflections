import React from "react";
import "./Filter.css";
function Filter() {
    return (
        <div className="filter-container">
            <h2>Filter Posts</h2>
            <div className="filter-options">

                <label>
                    <input type="checkbox" name="tag1" />
                    Tag 1
                </label>

                <label>
                    <input type="checkbox" name="tag2" />
                    Tag 2
                </label>

                <label>
                    <input type="checkbox" name="tag3" />
                    Tag 3
                </label>
                
            </div>
        </div>

    );

}

export default Filter;