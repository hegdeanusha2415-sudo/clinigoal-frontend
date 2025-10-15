import React from 'react';

const SearchFilter = ({ 
  type, 
  searchTerm, 
  setSearchTerm, 
  filterCourse, 
  setFilterCourse, 
  courses 
}) => {
  return (
    <div className="search-filter-bar">
      <div className="search-box">
        <input
          type="text"
          placeholder={`Search ${type}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <span className="search-icon">🔍</span>
      </div>
      
      <select
        value={filterCourse}
        onChange={(e) => setFilterCourse(e.target.value)}
        className="filter-select"
      >
        <option value="">All Courses</option>
        {courses.map(course => (
          <option key={course._id} value={course._id}>
            {course.title}
          </option>
        ))}
      </select>
      
      <button 
        className="btn-secondary"
        onClick={() => {
          setSearchTerm('');
          setFilterCourse('');
        }}
      >
        Clear Filters
      </button>
    </div>
  );
};

export default SearchFilter;