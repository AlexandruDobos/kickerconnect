// GroupsList.js
import React from 'react';
import { View } from 'react-native';
import GroupItem from './GroupItem';

const GroupsList = ({ groups, selected, onGroupDetails }) => {
  if (!groups) { //|| selected !== 'Grupuri publice'
    return null;
  } else {
  }

  return (
    <View>
      {groups.map(group => (
        <GroupItem key={group.id} group={group} selected={selected} onPress={onGroupDetails} memberCount={group.members.length} />
      ))}
    </View>
  );
};

export default GroupsList;