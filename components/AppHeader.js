
import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text } from 'react-native';
import { Appbar } from 'react-native-paper';

const AppHeader = ({ title, username }) => {
  return (
    <Appbar.Header style={styles.header}>
      <Appbar.Content title={title || "Budgy"} titleStyle={styles.headerTitle} />
      <Text style={styles.headerUser}>{username || "berfin"}</Text>
    </Appbar.Header>
  );
};

AppHeader.propTypes = {
    title: PropTypes.string,
    username: PropTypes.string,
  };

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#7D2998',
    elevation: 0,
    justifyContent: 'space-between',
  },
  headerTitle: {
    color: 'white',
    fontWeight: 'bold',
  },
  headerUser: {
    color: 'white',
    fontSize: 16,
    marginRight: 16,
  },
});

export default AppHeader;