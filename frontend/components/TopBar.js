import React, { useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ip, port } from '../core/utils';
import { useUser } from '../context/UserContext';

const TopBar = ({ selected, onSelect, onSelectGroup }) => {
  const { userData } = useUser();

  useEffect(() => {
    handlePress();
  }, [selected]);

  const handlePress = () => {
    if (selected === 'Grupurile mele') {
      const fetchUrl = "http://" + ip + ":" + port + "/group/getAll";
      fetch(fetchUrl)
        .then(response => response.json())
        .then(data => {
          let groups = [];
          data.forEach(group => {
            const isUserMember = group.members.some(member => member.id === userData.id);
            group.isUserMember = isUserMember;
            if (isUserMember) {
              groups.push(group);
            }
          });
          onSelectGroup(groups);
        })
        .catch(error => console.log("Error selecting groups: " + error));
    } else if (selected === 'Căutare') {
    } else {
      const fetchUrl = "http://" + ip + ":" + port + "/group/getAll";
      fetch(fetchUrl)
        .then(response => response.json())
        .then(data => {
          const activeGroups = data.filter(group => group.active === true);
          onSelectGroup(activeGroups);
        })
        .catch(error => console.log("Error selecting groups: " + error));
    }
  };

  return (
    <SafeAreaView style={styles.topBar}>
      <TouchableOpacity
        style={[styles.iconWithText, selected === 'Grupurile mele' && styles.selected]}
        onPress={() => { onSelect('Grupurile mele'); handlePress(); }}
      >
        <Ionicons name="flame" size={24} color="black" style={styles.icon} />
        <Text style={styles.text}>Grupurile mele</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.iconWithText, selected === 'Grupuri publice' && styles.selected]}
        onPress={() => {
          onSelect('Grupuri publice');
          handlePress();
        }}
      >
        <Ionicons name="people" size={24} color="black" style={styles.icon} />
        <Text style={styles.text}>Grupuri publice</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.iconWithText, selected === 'Căutare' && styles.selected]}
        onPress={() => onSelect('Căutare')}
      >
        <Ionicons name="search" size={24} color="black" style={styles.icon} />
        <Text style={styles.text}>Căutare</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    borderBottomWidth: 2,
    borderColor: '#CCCCCC',
  },
  iconWithText: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    borderLeftWidth: 0.5,
    borderColor: '#CCCCCC',
  },
  text: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  selected: {
    backgroundColor: '#DDF2FD',
  },
  icon: {
    fontSize: 24,
  }
});

export default TopBar;
