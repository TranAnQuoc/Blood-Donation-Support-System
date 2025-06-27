import React from 'react';
import styles from './SearchBar.module.css';
import { FaSearch } from 'react-icons/fa';

const SearchBar = () => {
  return (
    <div className={styles.searchBar}>
      <input type="text" placeholder="Tìm kiếm..." className={styles.searchInput} />
      <FaSearch className={styles.searchIcon} />
    </div>
  );
};

export default SearchBar;