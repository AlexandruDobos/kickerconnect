import React, { useState, useEffect } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform, TextInput, Dimensions, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../context/UserContext';
import EditPlayerModal from './EditPlayerModal';

const GenerateTeamsModal = ({ event, onClose, isGenerateTeamsModalVisible }) => {
    const { userData } = useUser();
    const [teams, setTeams] = useState([]);
    const [newTeamName, setNewTeamName] = useState('');
    const [newPlayer, setNewPlayer] = useState({ username: "", stars: 1, isAddedBy: null });
    const [teamNames, setTeamNames] = useState(['Echipa 1', 'Echipa 2', 'Echipa 3']);
    const [registeredPlayers, setRegisteredPlayers] = useState(event.registeredPlayers || []);
    const [isAddingPlayer, setIsAddingPlayer] = useState(false);
    const [isEditPlayer, setIsEditPlayer] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [editPlayer, setEditPlayer] = useState({ name: "", stars: 1 });
    const [selectedRating, setSelectedRating] = useState(1);
    const [selectedPlayerForEdit, setSelectedPlayerForEdit] = useState(null);
    const [errorGenerateTeamsMessage, setErrorGenerateTeamsMessage] = useState(null);
    const [isGenerateButtonPressed, setIsGeneratedButtonPressed] = useState(false);
    const [generatedTeams, setGeneratedTeams] = useState([]);

    useEffect(() => {
        handleAddDefaultTeams();
    }, []);

    const handleAddDefaultTeams = () => {
        setTeams(teamNames);
    };

    const handleAddTeam = () => {
        if (newTeamName.trim() !== '') {
            setTeams([...teams, newTeamName.trim()]);
            setNewTeamName('');
        }
    };

    const handleAddPlayer = () => {
        setIsAddingPlayer(true);
    };

    const handleRatingChange = (rating) => {
        setSelectedRating(rating);
    };

    const handleSubmit = () => {
        setIsAddingPlayer(false);
        if (newPlayer.username.trim() !== '') {
            const newName = newPlayer.username.trim().toLowerCase();
            const isDuplicate = registeredPlayers.some(player => player.username.toLowerCase() === newName);
            if (isDuplicate) {
                setErrorMessage("Există deja un jucător cu acest nume.");
            } else {
                setRegisteredPlayers([...registeredPlayers, { ...newPlayer, stars: selectedRating, isAddedBy: userData.username }]);
                setErrorMessage(null);
            }
            
        }
    };

    const handleDeleteTeam = (index) => {
        const updatedTeams = teams.filter((_, i) => i !== index);
        setTeams(updatedTeams);
    };

    const handleTeamNameChange = (text, index) => {
        const updatedTeams = [...teams];
        updatedTeams[index] = text;
        setTeams(updatedTeams);
    };

    const handleDeletePlayer = (player) => {
        const updatedRegisteredPlayers = registeredPlayers.filter(element => element.id !== player.id);
        setRegisteredPlayers(updatedRegisteredPlayers);
    };

    const handleEditPlayer = (player) => {
        setIsEditPlayer(true);
        setSelectedPlayerForEdit(player);
        setErrorGenerateTeamsMessage(null);
    };

    const handleGenerate = () => {
        let messageError = "";
        registeredPlayers.forEach(player => {
            if (player.username.trim() === "") {
                if (messageError && !messageError.includes("Nu toti playerii au un nume")) {
                    messageError = messageError + "Nu toti playerii au un nume\n";
                }
            } else if (player.stars === null) {
                messageError = messageError + player.username + " nu are setat ratingul.\n";
            }
        });
        setErrorGenerateTeamsMessage(messageError);

        if (messageError === "") {
            setIsGeneratedButtonPressed(true);
        } else {
            setIsGeneratedButtonPressed(false);
        }
    };

    const generateTeamsWithHooligan = (players, numTeams) => {
        players.sort(() => Math.random() - 0.5);
        const teams = Array.from({ length: numTeams }, () => []);
        const sortedPlayers = players.sort((a, b) => b.stars - a.stars);
        sortedPlayers.forEach((player, index) => {
            const teamIndex = index % numTeams;
            teams[teamIndex].push(player);
        });
        return teams;
    };

    const handleGenerateNormal = () => {
        const players = registeredPlayers.map(player => ({ ...player, stars: 1 }));
        const numTeams = teams.length;
        const generatedTeams = generateTeamsWithHooligan(players, numTeams);
        setGeneratedTeams(generatedTeams);
    };

    const handleGenerateSkillLevel = () => {
        const players = registeredPlayers;
        const numTeams = teams.length;
        const generatedTeams = generateTeamsWithHooligan(players, numTeams);
        setGeneratedTeams(generatedTeams);
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isGenerateTeamsModalVisible}
            onRequestClose={onClose}
        >
            <SafeAreaView style={styles.modalContainer}>
                <ScrollView>
                    <View style={styles.content}>
                        <View style={styles.closeButton}>
                            <Ionicons onPress={onClose} name="close-circle" size={36} color="black" />
                        </View>
                        <Text style={styles.generateText}>Generate Teams</Text>
                        <View style={styles.teamContainer}>
                            <Text style={styles.generateText}>Număr și nume echipe</Text>
                            {teams.map((team, index) => (
                                <View key={index} style={styles.teamRow}>
                                    <TextInput
                                        style={styles.input}
                                        value={team}
                                        onChangeText={(text) => handleTeamNameChange(text, index)}
                                        placeholder="Nume echipă"
                                        placeholderTextColor="black"
                                    />
                                    <TouchableOpacity onPress={() => handleDeleteTeam(index)} style={styles.deleteButton}>
                                        <Ionicons name="trash-outline" size={24} color="red" />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                        <View style={styles.addingDetailsStyle}>
                            <TextInput
                                style={styles.input}
                                placeholder="Numele echipei"
                                value={newTeamName}
                                onChangeText={text => setNewTeamName(text)}
                                placeholderTextColor="black"
                            />
                            <TouchableOpacity onPress={() => handleAddTeam()} style={styles.addButton}>
                                <Text style={styles.addButtonText}>Adaugă echipă</Text>
                            </TouchableOpacity>
                            {!isAddingPlayer && (
                                <TouchableOpacity onPress={() => handleAddPlayer()} style={styles.addButton}>
                                    <Text style={styles.addButtonText}>Adaugă jucător</Text>
                                </TouchableOpacity>
                            )}
                            {isAddingPlayer && (
                                <View style={styles.addPlayerContainer}>
                                    <View style={styles.innerContainer}>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Numele jucătorului"
                                            value={newPlayer.username}
                                            onChangeText={text => setNewPlayer({ ...newPlayer, username: text })}
                                            placeholderTextColor="black"
                                        />
                                        <Text style={styles.label}>Alege nota</Text>
                                        <View style={styles.squareContainer}>
                                            {[1, 2, 3, 4, 5].map((number) => (
                                                <TouchableOpacity
                                                    key={number}
                                                    style={[styles.square, selectedRating === number && styles.selectedSquare]}
                                                    onPress={() => handleRatingChange(number)}
                                                >
                                                    <Text style={styles.squareText}>{number}</Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                        <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
                                            <Text style={styles.submitButtonText}>Submit</Text>
                                        </TouchableOpacity>
                                        {errorMessage && <Text>{errorMessage}</Text>}
                                    </View>
                                </View>
                            )}
                        </View>
                        <View style={styles.playersContainer}>
                            {registeredPlayers.map((player, index) => (
                                <View style={styles.playerItem} key={player.id}>
                                    <View style={styles.playerInfo}>
                                        <Text style={styles.playerCount}>{index + 1}</Text>
                                        <Ionicons name="thumbs-up-outline" size={21} color="black" style={styles.playerIcon} />
                                        <Text style={styles.playerName}>
                                            {player.username}
                                        </Text>
                                    </View>
                                    <View style={styles.editDeleteContainer}>
                                        <Text style={styles.playerRating}>Stars: {player.stars}</Text>
                                        <Ionicons name="star-outline" size={24} color="black" />
                                        <Ionicons onPress={() => handleEditPlayer(player)} name="create-outline" size={24} color="black" />
                                        <Ionicons onPress={() => handleDeletePlayer(player)} name="close-circle" size={24} color="black" />
                                    </View>
                                    {player.username && selectedPlayerForEdit === player && (
                                        <EditPlayerModal
                                            player={player}
                                            onClose={() => setSelectedPlayerForEdit(null)}
                                            onSave={(editedPlayer) => {
                                                const updatedPlayers = registeredPlayers.map(player => {
                                                    if (player.id === editedPlayer.id) {
                                                        return editedPlayer;
                                                    } else {
                                                        return player;
                                                    }
                                                });
                                                setRegisteredPlayers(updatedPlayers);
                                            }}
                                        />
                                    )}
                                </View>
                            ))}
                        </View>
                        <TouchableOpacity onPress={handleGenerate} style={styles.button}>
                            <Text style={styles.buttonText}>Generate</Text>
                        </TouchableOpacity>
                        {isGenerateButtonPressed && (
                            <View style={styles.generateTeamsButtons}>
                                <TouchableOpacity onPress={handleGenerateNormal} style={styles.button}>
                                    <Text style={styles.buttonText}>Normal</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={handleGenerateSkillLevel} style={styles.button}>
                                    <Text style={styles.buttonText}>Skill level</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                        {errorGenerateTeamsMessage && <Text>{errorGenerateTeamsMessage}</Text>}
                        {generatedTeams && (
                            <View>
                                {generatedTeams.map((team, index) => (
                                    <View style={styles.teamContainer} key={index}>
                                        <Text style={styles.teamName}>Echipa {index + 1}:</Text>
                                        {team.map((player, playerIndex) => (
                                            <Text style={styles.player} key={playerIndex}>{player.username} ({player.stars})</Text>
                                        ))}
                                        <Text style={styles.totalStars}>Suma starurilor: {team.reduce((acc, player) => acc + player.stars, 0)}</Text>
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        width: Dimensions.get('window').width,
        height: '100%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    addingDetailsStyle: {
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center"
    },
    generateText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    teamContainer: {
        marginTop: "20%",
        marginBottom: 20,
    },
    teamRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    deleteButton: {
        padding: 5,
    },
    addButton: {
        backgroundColor: 'blue',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 10,
        marginBottom: 10,
        width: '70%',
    },
    addButtonText: {
        color: 'white',
        fontSize: 18,
        alignSelf: "center"
    },
    input: {
        width: '70%',
        height: 40,
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 5,
        paddingHorizontal: 10,
        color: 'black',
    },
    playersContainer: {
        width: '100%',
        alignSelf: 'flex-start',
        marginTop: 10,
    },
    playerItem: {
        display: "flex",
        flexDirection: 'row',
        justifyContent: "space-between",
        backgroundColor: 'lightgrey',
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
    },
    playerIcon: {
        marginRight: 10,
    },
    playerName: {
        fontSize: 16,
    },
    playerCount: {
        marginRight: 10,
    },
    squareContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    square: {
        width: 50,
        height: 50,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectedSquare: {
        backgroundColor: '#DDF2FD',
    },
    squareText: {
        fontSize: 18,
    },
    addPlayerContainer: {
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    innerContainer: {
        width: '100%',
        alignItems: 'center',
    },
    submitButton: {
        backgroundColor: 'blue',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 10,
        width: '100%',
        alignItems: 'center',
    },
    submitButtonText: {
        color: 'white',
        fontSize: 18,
    },
    playerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    playerRating: {
        marginLeft: 'auto',
        fontSize: 16,
    },
    editDeleteContainer: {
        display: "flex",
        flexDirection: "row",
    },
    button: {
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
    generateTeamsButtons: {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-evenly",
        marginBottom: "5%",
    },
    teamContainer: {
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
        alignItems: 'center',
    },
    teamName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        textAlign: 'center',
    },
    player: {
        fontSize: 16,
        marginBottom: 3,
    },
    totalStars: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 5,
    },
});

export default GenerateTeamsModal;
