// GroupItem.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const GroupItem = ({ group, selected, onPress, memberCount }) => {
    if (!group ) {//|| selected !== 'Grupuri publice'
        return null;
    }
    return (
        <TouchableOpacity onPress={() => onPress(group)}>

            <View style={styles.container}>
                <View style={styles.iconContainer}>
                    <Ionicons name="football" size={24} color="black" />
                </View>
                <View style={styles.contentContainer}>
                    <Text style={[styles.name, styles.colorText]}>{group.name}</Text>
                    <Text style={[styles.details, styles.color]}>{group.details}</Text>
                    <View style={styles.infoContainer}>
                        <View style={styles.infoContainer}>
                            <Ionicons name="people" size={24} color="black" />
                            <Text style={[styles.members, styles.colorText]}> {memberCount} members</Text>
                        </View>
                        <Text style={[styles.creator, styles.colorText]}>Creator: {group.creator}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 0.5,
        borderColor: 'black',
        borderRadius: 10,
        padding: 10,
        marginVertical: 5,
        marginLeft: 5,
        marginRight: 5,
       // backgroundColor: 'white'
       backgroundColor: '#F0F0F0'

    },
    iconContainer: {
        marginRight: 10,
    },
    contentContainer: {
        flex: 1,
    },
    name: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 5,
        textAlign: 'center',
        
    },
    details: {
        fontSize: 16,
        marginBottom: 5,
        textAlign: 'center',
    },
    infoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginTop: 5,
    },
    members: {
        fontStyle: 'italic',
        textDecorationLine: 'underline',
    },
    creator: {
        fontStyle: 'italic',
        textDecorationLine: 'underline',
    },
    colorText:{
        color: '#333333',
    },

});

export default GroupItem;