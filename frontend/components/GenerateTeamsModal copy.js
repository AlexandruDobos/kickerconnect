import React, { useState, useEffect } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform, TextInput, Dimensions, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../context/UserContext';
import { KeyboardAvoidingView } from 'react-native';
import EditPlayerModal from './EditPlayerModal';
const GenerateTeamsModal = ({ event, onClose, isGenerateTeamsModalVisible }) => {
    const { userData, updateUserData } = useUser();
    const [teams, setTeams] = useState([]);
    const [newTeamName, setNewTeamName] = useState('');
    const [newPlayer, setNewPlayer] = useState({ username: "", rating: 1 })
    const [teamNames, setTeamNames] = useState(['Echipa 1', 'Echipa 2', 'Echipa 3']);
    const [registeredPlayers, setRegisteredPlayers] = useState(event.registeredPlayers || []);
    const [isAddingPlayer, setIsAddingPlayer] = useState(false);
    const [isEditPlayer, setIsEditPlayer] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null);
    const [editPlayer, setEditPlayer] = useState({ name: "", rating: 1 })
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
    }

    const [selectedRating, setSelectedRating] = useState(1);
    // Funcție pentru gestionarea schimbării notei selectate
    const handleRatingChange = (rating) => {
        setSelectedRating(rating);
        console.log(rating)
    };

    const handleSubmit = () => {
        setIsAddingPlayer(false);
        if (newPlayer.username.trim() !== '') {
            const newName = newPlayer.username.trim().toLowerCase(); // Convertim numele introdus de utilizator la litere mici
            const isDuplicate = registeredPlayers.some(player => player.username.toLowerCase() === newName);
            if (isDuplicate) {
                setErrorMessage("Există deja un jucător cu acest nume.");
            } else {
                setRegisteredPlayers([...registeredPlayers, { username: newName, stars: selectedRating }]);
                setErrorMessage(null); // Pentru a șterge mesajul de eroare dacă nu mai există duplicat
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
        let updatedRegisteredPlayers = registeredPlayers;
        updatedRegisteredPlayers = updatedRegisteredPlayers.filter(element => element.id !== player.id);
        setRegisteredPlayers(updatedRegisteredPlayers);

    }

    const [selectedPlayerForEdit, setSelectedPlayerForEdit] = useState(null);
    const handleEditPlayer = (player) => {
        setIsEditPlayer(true);
        setSelectedPlayerForEdit(player);
        console.log("am intrat in editPlayer")
        setErrorGenerateTeamsMessage(null);
    }

    const [errorGenerateTeamsMessage, setErrorGenerateTeamsMessage] = useState(null);
    const [isGenerateButtonPressed, setIsGeneratedButtonPressed] = useState(false);
    const handleGenerate = () => {
        console.log("Generating...")
        let messageError = "";
        registeredPlayers.map(player => {
            if (player.username.trim() === "") {
                console.log("Nu toti playerii au un nume")
                if (messageError && !messageError.includes("Nu toti playerii au un nume")) { messageError = messageError + "Nu toti playerii au un nume\n"; }
            } else if (player.stars === null) {
                console.log("Nu toti playerii au rating")
                messageError = messageError + player.username.replace(/Adaugat de \d+/, '').trim() + " nu are setat ratingul.\n"
            }
        })
        setErrorGenerateTeamsMessage(messageError);

        if (messageError === "") {
            setIsGeneratedButtonPressed(true);
        } else {
            setIsGeneratedButtonPressed(false)
        }
    }

    // // Funcție pentru generarea echipei
    // function generateTeamsWithRatings(players, numTeams) {
    //     // Amestecăm aleatoriu jucătorii
    //     players.sort(() => Math.random() - 0.5);

    //     // Inițializăm echipele
    //     const teams = Array.from({ length: numTeams }, () => []);

    //     // Sortăm jucătorii în funcție de notă
    //     const sortedPlayers = players.sort((a, b) => a.stars - b.stars);

    //     // Distribuim jucătorii în echipe
    //     sortedPlayers.forEach((player, index) => {
    //         const teamIndex = index % numTeams;
    //         teams[teamIndex].push(player);
    //     });

    //     return teams;
    // }

    // Funcție pentru generarea echipei cu strategia h00ligan
    function generateTeamsWithHooligan(players, numTeams) {
        // Amestecăm aleatoriu jucătorii
        players.sort(() => Math.random() - 0.5);

        // Inițializăm echipele
        const teams = Array.from({ length: numTeams }, () => []);

        // Sortăm jucătorii în funcție de notă (descrescător)
        const sortedPlayers = players.sort((a, b) => b.stars - a.stars);

        // Distribuim jucătorii în echipe cu strategia h00ligan
        sortedPlayers.forEach((player, index) => {
            const teamIndex = index % numTeams;
            teams[teamIndex].push(player);
        });

        return teams;
    }

    const [generatedTeams, setGeneratedTeams] = useState([]);

    const handleGenerateNormal = () => {
        console.log("Normal")
        // Exemplu de utilizare
        // Exemplu de utilizare
        const numPlayers = 8;
        const players = registeredPlayers;
        const playersCopy = players.map(player => ({ ...player, stars: 1 }));
        const numTeams = teams.length

        // const teams = generateTeamsWithRatings(players, numTeams);
        // teams.forEach((team, index) => {
        //     // Calculăm suma stars pentru echipa curentă
        //     const totalStars = team.reduce((acc, player) => acc + player.stars, 0);

        //     // Afișăm echipa, numărul total de jucători și suma stars asociată
        //     console.log(`Echipa ${index + 1}: ${team.map(player => `${player.name}(${player.stars})`).join(', ')} - Numărul total de jucători: ${team.length} - Suma stars: ${totalStars}`);
        // });


        const generatedTeams = generateTeamsWithHooligan(playersCopy, numTeams);
        setGeneratedTeams(generatedTeams);
        generatedTeams.forEach((team, index) => {
            const totalStars = team.reduce((acc, player) => acc + player.stars, 0);
            console.log(`Echipa ${index + 1}: ${team.map(player => `${player.username}(${player.stars})`).join(', ')} - Numărul total de jucători: ${team.length} - Suma stars: ${totalStars}`);
        });
    }

    const handleGenerateSkillLevel = () => {
        console.log("Skill level")
        const numPlayers = 8;
        const players = registeredPlayers;
        const numTeams = teams.length
        //console.log(teams);


        // const teams = generateTeamsWithRatings(players, numTeams);
        // teams.forEach((team, index) => {
        //     // Calculăm suma stars pentru echipa curentă
        //     const totalStars = team.reduce((acc, player) => acc + player.stars, 0);

        //     // Afișăm echipa, numărul total de jucători și suma stars asociată
        //     console.log(`Echipa ${index + 1}: ${team.map(player => `${player.name}(${player.stars})`).join(', ')} - Numărul total de jucători: ${team.length} - Suma stars: ${totalStars}`);
        // });


        const generatedTeams = generateTeamsWithHooligan(players, numTeams);
        setGeneratedTeams(generatedTeams);
        generatedTeams.forEach((team, index) => {
            const totalStars = team.reduce((acc, player) => acc + player.stars, 0);
            console.log(`Echipa ${index + 1}: ${team.map(player => `${player.username}(${player.stars})`).join(', ')} - Numărul total de jucători: ${team.length} - Suma stars: ${totalStars}`);
        });
    }

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

                            {!isAddingPlayer && <TouchableOpacity onPress={() => handleAddPlayer()} style={styles.addButton}>
                                <Text style={styles.addButtonText}>Adaugă jucător</Text>
                            </TouchableOpacity>
                            }
                            {isAddingPlayer && (
                                <View style={styles.addPlayerContainer}>
                                    <View style={styles.innerContainer}>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Numele jucătorului"
                                            value={newPlayer.username}
                                            onChangeText={text => setNewPlayer({ username: text })}
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

                                <View style={styles.playerItem} key={player.username}>
                                    <View style={styles.playerInfo}>
                                        <Text style={styles.playerCount}>{index + 1}</Text>
                                        <Ionicons name="thumbs-up-outline" size={21} color="black" style={styles.playerIcon} />
                                        <Text style={styles.playerName}>{player.username ? player.username.replace(/Adaugat de \d+/, '').trim() : ''}</Text>

                                    </View>

                                    <View style={styles.editDeleteContainer}>
                                        {player.username && (
                                            <TouchableOpacity >
                                                <View style={styles.editDeleteContainer}>
                                                    <Text style={styles.playerRating}>Stars: {player.stars}</Text>
                                                    <Ionicons name="star-outline" size={24} color="black" />
                                                    <Ionicons onPress={() => handleEditPlayer(player)} name="create-outline" size={24} color="black" />
                                                    <Ionicons onPress={() => handleDeletePlayer(player)} name="close-circle" size={24} color="black" />
                                                </View>
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                    {player.username && selectedPlayerForEdit === player && (
                                        <EditPlayerModal
                                            player={player}
                                            onClose={() => setSelectedPlayerForEdit(null)}
                                            onSave={(editedPlayer) => {
                                                // Implementează funcționalitatea pentru salvarea jucătorului editat
                                                // Aici ar trebui să actualizezi registeredPlayers cu jucătorul editat
                                                //console.log("Player saved:", editedPlayer);
                                                const updatedPlayers = registeredPlayers.map(player => {
                                                    if (player.id === editedPlayer.id) {
                                                        // Dacă id-ul jucătorului se potrivește cu id-ul jucătorului editat, actualizează jucătorul
                                                        return editedPlayer;
                                                    } else {
                                                        // În caz contrar, returnează jucătorul nemodificat
                                                        return player;
                                                    }
                                                });
                                                setRegisteredPlayers(updatedPlayers);
                                            }}
                                        />
                                    )}
                                </View>
                            )

                            )}
                        </View>
                        <TouchableOpacity onPress={handleGenerate} style={styles.button}>
                            <Text style={styles.buttonText}>Generate</Text>

                        </TouchableOpacity>
                        {isGenerateButtonPressed &&
                            <View style={styles.generateTeamsButtons}>
                                <TouchableOpacity onPress={handleGenerateNormal} style={styles.button}>
                                    <Text style={styles.buttonText}>Normal</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={handleGenerateSkillLevel} style={styles.button}>
                                    <Text style={styles.buttonText}>Skill level</Text>
                                </TouchableOpacity>
                            </View>}
                        {errorGenerateTeamsMessage && <Text>{errorGenerateTeamsMessage}</Text>}
                        {generatedTeams &&
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
                        }
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
        alignSelf: "centerz"
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
        //alignItems: 'center',
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
        //flex: 1,
    },
    playerRating: {
        marginLeft: 'auto', // Afișează ratingul în partea dreaptă a casetei jucătorului
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
        backgroundColor: '#f0f0f0', // culoarea fundalului
        borderRadius: 10, // margini rotunde
        padding: 10, // spațiere între conținut și margini
        marginBottom: 10, // spațiere între echipe
        alignItems: 'center', // centram conținutul pe axa orizontală
    },
    teamName: {
        fontSize: 18, // mărimea fontului pentru numele echipei
        fontWeight: 'bold', // text bold
        marginBottom: 5, // spațiere între numele echipei și jucători
        textAlign: 'center', // centram textul
    },
    player: {
        fontSize: 16, // mărimea fontului pentru numele jucătorilor
        marginBottom: 3, // spațiere între jucători
    },
    totalStars: {
        fontSize: 16, // mărimea fontului pentru suma starurilor
        fontWeight: 'bold', // text bold
        marginTop: 5, // spațiere între jucători și suma starurilor
    },
});


export default GenerateTeamsModal;
