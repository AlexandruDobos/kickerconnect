import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, FlatList, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import TopBar from '../components/TopBar';
import GroupsList from '../components/GroupsList';
import GroupDetailsModal from '../components/GroupDetailsModal';
import { useUser } from '../context/UserContext';
import { ip, port } from '../core/utils';
import BottomBar from '../components/BottomBar';
import { useEvent } from '../context/EventContext';

function GroupsPage() {
    const [selected, setSelected] = useState('Grupuri publice');
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [cities, setCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const { userData } = useUser();
    const { updateEventData } = useEvent();
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        fetchCities();
    }, []);

    useEffect(() => {
        if (selected === 'Grupuri publice') {
            fetchGroups(selectedCity);
        }
    }, [selected, selectedCity]);

    const fetchCities = () => {
        const fetchUrl = "http://" + ip + ":" + port + "/group/getAll";
        fetch(fetchUrl)
            .then(response => response.json())
            .then(data => {
                const uniqueCities = [...new Set(data.map(group => group.location))];
                setCities(uniqueCities);
            })
            .catch(error => console.log("Error fetching cities: " + error));
    };

    const fetchGroups = (city) => {
        const fetchUrl = "http://" + ip + ":" + port + "/group/getAll";
        fetch(fetchUrl)
            .then(response => response.json())
            .then(data => {
                const filteredGroups = city
                    ? data.filter(group => group.active && group.location === city)
                    : data.filter(group => group.active);
                setGroups(filteredGroups);
            })
            .catch(error => console.log("Error fetching groups: " + error));
    };

    const handleGroupDetails = (group) => {
        setSelectedGroup(group);
        if (group.events && group.events.length > 0) {
            updateEventData(group.events[0]);
        }
    };

    const handleCloseModal = () => {
        setSelectedGroup(null);
    };

    const handleSubmit = (value) => {
        const fetchUrl = "http://" + ip + ":" + port + "/group/getAll";
        fetch(fetchUrl)
            .then(response => response.json())
            .then(data => {
                const filteredGroups = data.filter(group => group.name.toLowerCase().includes(value.toLowerCase()));
                setGroups(filteredGroups);
            })
            .catch(error => console.log("Error searching groups: " + error));
    };

    const handleJoin = () => {
        const userId = { id: userData.id };
        let groupMembers = selectedGroup.members;
        const idExists = groupMembers.some(object => object.id === userData.id);
        if (!idExists) {
            groupMembers = groupMembers.concat(userId);
            const fetchUrl = "http://" + ip + ":" + port + "/group?group=" + selectedGroup.id;
            fetch(fetchUrl, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ members: groupMembers }),
            })
                .then(response => response.json())
                .then(data => {
                    if (!data.errorMessage) {
                        setSelectedGroup(prevGroup => ({ ...prevGroup, members: groupMembers }));
                    }
                })
                .catch(error => console.error('Error adding user:', error));
        } else {
            console.log("Userul este deja inscris in grup");
        }
    };

    const handleSelectCity = (city) => {
        setSelectedCity(city);
        setShowDropdown(false);
        fetchGroups(city);
    };

    const filteredCities = cities.filter(city => city.toLowerCase().includes(selectedCity.toLowerCase()));

    return (
        <TouchableWithoutFeedback onPress={() => { setShowDropdown(false); Keyboard.dismiss(); }}>
            <View style={styles.mainContainer}>
                <TopBar selected={selected} onSelect={setSelected} onSelectGroup={setGroups} />
                {selected === 'Căutare' && (
                    <View style={styles.container}>
                        <TextInput
                            style={styles.input}
                            placeholder="Introduceți termenul de căutare"
                            value={searchText}
                            onChangeText={(value) => { setSearchText(value); handleSubmit(value); }}
                        />
                    </View>
                )}
                {selected === 'Grupuri publice' && (
                    <View style={styles.container}>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Selectați un oraș"
                                placeholderTextColor="transparent" 
                                value={selectedCity}
                                onChangeText={(value) => { setSelectedCity(value); setShowDropdown(true); }}
                                onFocus={() => setShowDropdown(true)}
                            />
                            {!selectedCity && <Text style={styles.placeholder}>Selectați un oraș</Text>}
                        </View>
                        {showDropdown && (
                            <FlatList
                                data={filteredCities}
                                keyExtractor={(item) => item}
                                renderItem={({ item }) => (
                                    <TouchableOpacity onPress={() => handleSelectCity(item)}>
                                        <Text style={styles.cityItem}>{item}</Text>
                                    </TouchableOpacity>
                                )}
                                style={styles.dropdown}
                            />
                        )}
                    </View>
                )}
                <ScrollView style={styles.scrollView}>
                    <GroupsList groups={groups} selected={selected} onGroupDetails={handleGroupDetails} />
                    {selectedGroup && (
                        <GroupDetailsModal key={selectedGroup.id} group={selectedGroup} onClose={handleCloseModal} onJoin={handleJoin} />
                    )}
                </ScrollView>
                <BottomBar />
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: "white",
    },
    scrollView: {
        flex: 1,
    },
    container: {
        width: "100%",
        alignSelf: "center",
        display: "flex",
        alignItems: "center",
    },
    inputContainer: {
        position: 'relative',
        width: "70%",
        textAlign: "center",
    },
    input: {
        marginTop: 5,
        height: 35,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        paddingLeft: 10,
        textAlign: "center",
    },
    placeholder: {
        position: 'absolute',
        left: 10,
        top: 12,
        color: 'gray',
        fontSize: 16,
    },
    dropdown: {
        width: "60%",
        maxHeight: 150,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: 'white',
    },
    cityItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
    },
});

export default GroupsPage;
