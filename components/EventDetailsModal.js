import React, { useEffect, useRef, useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform, ScrollView, Alert } from 'react-native';
import { ImageBackground } from 'react-native';
import { useUser } from '../context/UserContext';
import { Ionicons } from '@expo/vector-icons';
import { ip, port } from '../core/utils';
import AddPlayerToEventModal from './AddPlayerToEventModal';
import { useNavigation } from '@react-navigation/native';
import GenerateTeamsModal from './GenerateTeamsModal';
import ChatModal from './ChatModal';
import { useEvent } from '../context/EventContext';
import ProfileModal from './ProfileModal';
import EventFeedbackModal from './EventFeedbackModal';

const EventDetailsModal = ({ event, visible, onClose, onUpdateEvent }) => {
  const { userData, updateUserData } = useUser();
  const navigation = useNavigation();
  const { eventData, updateEventData } = useEvent();

  const [joinFlag, setJoinFlag] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(event);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [playerNameInput, setPlayerNameInput] = useState('');
  const [isChatModalVisible, setIsChatModalVisible] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUsername, setSelectedUsername] = useState(null);
  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);
  const [isGenerateTeamsModalVisible, setIsGenerateTeamsModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isEventFeedbackModalVisible, setIsEventFeedbackModalVisible] = useState(false);

  const counterRef = useRef(0);
  const limit = 3;

  useEffect(() => {
    if (eventData && eventData.id) {
      const fetchUrl = `http://${ip}:${port}/event?event=${eventData.id}`;
      fetch(fetchUrl)
        .then(response => response.json())
        .then(data => {
          updateEventData(data);
          setLoading(false);
        })
        .catch(error => {
          console.log("Error selecting groups: " + error);
          setLoading(false);
        });
      counterRef.current++;
    }
  }, [eventData?.registeredPlayers?.length]);

  useEffect(() => {
    if (eventData) {
      const userId = { id: userData.id };
      const registeredPlayers = eventData.registeredPlayers || [];
      const idExists = registeredPlayers.some(object => object.id === userData.id);
      if (idExists) {
        setJoinFlag(true);
      }
    }
  }, [eventData]);

  const handleOpenChatModal = () => {
    setIsChatModalVisible(true);
  };

  const handleCloseChatModal = () => {
    setIsChatModalVisible(false);
  };

  const handleAddPlayerButton = () => {
    setIsModalVisible(true);
  };

  const fetchingData = (registeredPlayers) => {
    const fetchUrl = `http://${ip}:${port}/event?event=${eventData.id}`;

    fetch(fetchUrl, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        registeredPlayers: registeredPlayers
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.errorMessage) {
          updateEventData(data);
        }
      })
      .catch((error) => {
        console.error('Error logging user:', error);
      });
  };

  const handleDeletePlayer = (player) => {
    let registeredPlayers = eventData.registeredPlayers;
    registeredPlayers = registeredPlayers.filter(element => element.id !== player.id);
    fetchingData(registeredPlayers);
  };

  const handleJoinButton = () => {
    if (eventData.registeredPlayers.length >= 18) {
      if (joinFlag === true) {
        const userId = { id: userData.id };
        let registeredPlayers = eventData.registeredPlayers;
        registeredPlayers = registeredPlayers.filter(element => element.id !== userId.id);

        setJoinFlag(false);
        fetchingData(registeredPlayers);
      } else {
        Alert.alert(
          'Atenție',
          'Ne pare rău, s-au terminat locurile disponibile pentru acest eveniment.',
          [
            { text: 'OK', onPress: () => onClose() }
          ]
        );
      }
    } else {
      const userId = { id: userData.id };
      let registeredPlayers = eventData.registeredPlayers;
      if (joinFlag === true) {
        registeredPlayers = registeredPlayers.filter(element => element.id !== userId.id);

        setJoinFlag(false);
      } else {
        registeredPlayers = registeredPlayers.filter(element => element.id !== userId.id);
        registeredPlayers.push(userId);

        setJoinFlag(true);
      }

      fetchingData(registeredPlayers);
    }
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleGenerateTeams = () => {
    setIsGenerateTeamsModalVisible(true);
  };

  const handleCloseGenerateTeamsModal = () => {
    setIsGenerateTeamsModalVisible(false);
  };

  const handleOpenProfileModal = (userId, username) => {
    setSelectedUserId(userId);
    setSelectedUsername(username);
    setIsProfileModalVisible(true);
  };

  const handleCloseProfileModal = () => {
    setIsProfileModalVisible(false);
    setSelectedUserId(null);
  };

  const handleOpenEventFeedbackModal = () => {
    setIsEventFeedbackModalVisible(true);
  };

  const handleCloseEventFeedbackModal = () => {
    setIsEventFeedbackModalVisible(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        {/* <Text>Loading...</Text> */}
      </View>
    );
  }

  if (!eventData || !eventData.date) {
    return null;
  }

  const eventDate = new Date(eventData.date);
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const dayOfWeek = eventDate.toLocaleDateString('ro-RO', options);
  const formattedTime = eventDate.toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' });

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <View style={styles.content}>
            <View style={styles.background}>
              <ImageBackground source={require('../assets/images/groupImage2.jpg')} style={[styles.backgroundImage, { opacity: 0.85 }]}>
                <View style={styles.closeButtonContainer}>
                  <Ionicons onPress={handleOpenChatModal} name="chatbubbles-outline" size={36} color="black" style={styles.chatStyle} />
                  <Ionicons onPress={handleOpenEventFeedbackModal} name="happy-outline" size={36} color="black" style={styles.closeButton} />
                  <Ionicons onPress={onClose} name="close-circle" size={36} color="black" style={styles.closeButton} />
                  <ChatModal visible={isChatModalVisible} onClose={handleCloseChatModal} eventId={eventData.id} />
                </View>
                <Text style={styles.eventName}>{eventData.name}</Text>
                <Text style={styles.eventCreation}>Pentru {`${dayOfWeek}, ${formattedTime}`}</Text>
              </ImageBackground>
              <View id='2' style={styles.overlay}>
                <Text style={styles.firstText}>Detaliile evenimentului</Text>
                <Text style={styles.secondText}>{eventData.description}</Text>
              </View>
            </View>
          </View>
          <View style={styles.eventDetails}>
            <View style={styles.firstView}>
              <View>
                <Ionicons name="location-outline" size={36} color="black" />
              </View>
              <View style={styles.firstViewText}>
                <Text>Descriere locație</Text>
              </View>
            </View>
            <View style={styles.secondView}>
              <View>
                <Ionicons name="time-outline" size={36} color="black" />
              </View>
              <View style={styles.secondViewText}>
                <Text>{`${dayOfWeek}, ${formattedTime}`}</Text>
              </View>
            </View>
            <View style={styles.thirdView}>
              <View>
                <Ionicons name="people-outline" size={36} color="black" />
              </View>
              <View style={styles.thirdViewText}>
                <Text>{eventData.noOfPlayers} jucători</Text>
                <Text>{eventData.noOfTeams} echipe</Text>
              </View>
            </View>
            <View style={styles.buttons}>
              {joinFlag === true && <TouchableOpacity style={[styles.button, { backgroundColor: '#C70039' }]} onPress={handleJoinButton}>
                <Text style={[styles.buttonText, { color: "black" }]}>Renunță!</Text>
              </TouchableOpacity>}
              {joinFlag === false && <TouchableOpacity style={[styles.button, { backgroundColor: '#7F9F80' }]} onPress={handleJoinButton}>
                <Text style={[styles.buttonText, { color: "black" }]}>Înscrie-te!</Text>
                <Ionicons name="heart-circle-outline" size={21} color="black" />
              </TouchableOpacity>}
              <TouchableOpacity style={[styles.button, { backgroundColor: '#DDF2FD' }]} onPress={() => {
                if (eventData.registeredPlayers.length < 18)
                  setIsModalVisible(true)
                else {
                  Alert.alert(
                    'Atenție',
                    'Ne pare rău, s-au terminat locurile disponibile pentru acest eveniment.',
                    [
                      { text: 'OK', onPress: () => onClose() }
                    ]
                  );
                }
              }}>
                <Text style={[styles.buttonText, { color: "black" }]}>Adaugă jucător</Text>
                <Ionicons name="person-add-outline" size={21} color="black" />
              </TouchableOpacity>
              <AddPlayerToEventModal
                onClose={handleCloseModal}
                isModalVisible={isModalVisible}
                event={eventData}
                onUpdateEvent={updateEventData}
              />
            </View>
            <View style={styles.generateTeamsContainer}>
              <TouchableOpacity style={[styles.button, { backgroundColor: '#7F9F80' }]} onPress={handleGenerateTeams}>
                <Text style={[styles.buttonText, { color: "black" }]}>Generare echipe</Text>
                <Ionicons name="color-wand-outline" size={21} color="black" />
              </TouchableOpacity>
              <GenerateTeamsModal
                onClose={handleCloseGenerateTeamsModal}
                isGenerateTeamsModalVisible={isGenerateTeamsModalVisible}
                event={eventData}
              />
            </View>
            <View style={styles.titulars}>
              {Object.keys(eventData.registeredPlayers).length > 0 ? (
                <Text style={styles.titularsText}>Titulari:</Text>
              ) : (
                <Text style={styles.titularsText}>Nu există jucători înscriși</Text>
              )}
              <View style={styles.playersContainer}>
                {eventData.registeredPlayers.map((player, index) => (
                  <View style={styles.playerItem} key={player.id}>
                    <Text style={styles.playerCount}>{index + 1}</Text>
                    <Ionicons name="thumbs-up-outline" size={21} color="black" style={styles.playerIcon} />
                    <Text style={styles.playerName}
                      onPress={() => {
                        if (!player.isAddedBy) {
                          handleOpenProfileModal(player.id, player.username);
                        }
                      }}
                    >{player.username}
                    </Text>
                    {(player.isAddedBy === userData.username) && (
                      <TouchableOpacity onPress={() => handleDeletePlayer(player)}>
                        <Ionicons name="close-circle" size={24} color="black" />
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
      {isProfileModalVisible && (
        <ProfileModal
          visible={isProfileModalVisible}
          onClose={handleCloseProfileModal}
          userId={selectedUserId}
          username={selectedUsername}
        />
      )}
      <EventFeedbackModal
        visible={isEventFeedbackModalVisible}
        onClose={handleCloseEventFeedbackModal}
        eventName={eventData.name}
        eventId={eventData.id}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 20 : 0,
    backgroundColor: "#f0f0f0f0",
  },
  content: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  background: {
    position: 'relative',
    width: '100%',
    height: 300,
    marginBottom: 20,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  eventCreation: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  overlay: {
    position: 'absolute',
    bottom: -20,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'black',
    left: 20,
    right: 20,
    backgroundColor: '#427D9D',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  firstText: {
    color: 'white',
    fontSize: 22,
  },
  secondText: {
    fontSize: 14,
    color: 'white',
    fontStyle: 'italic',
  },
  closeButtonContainer: {
    flexDirection: 'row',
    position: 'absolute',
    top: 10,
    right: 10,
  },
  closeButton: {
    opacity: 1,
    color: 'white',
  },
  chatStyle: {
    opacity: 1,
    color: 'white',
  },
  firstView: {
    flexDirection: 'row',
    top: 20,
    left: 20,
  },
  secondView: {
    flexDirection: 'row',
    top: 20,
    left: 20,
  },
  thirdView: {
    flexDirection: 'row',
    top: 20,
    left: 20,
  },
  firstViewText: {
    alignSelf: 'center',
    marginLeft: 5,
  },
  secondViewText: {
    alignSelf: 'center',
    marginLeft: 5,
  },
  thirdViewText: {
    alignSelf: 'center',
    marginLeft: 5,
  },
  buttons: {
    marginTop: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  button: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "40%",
    backgroundColor: 'blue',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    marginLeft: "5%",
    marginRight: "5%"
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    textAlign: "center",
  },
  titulars: {
    display: "flex",
    width: "100%",
    left: 20,
  },
  titularsText: {
    fontSize: 20,
  },
  playersContainer: {
    width: '80%',
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  playerItem: {
    flexDirection: 'row',
    alignItems: 'center',
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
  generateTeamsContainer: {
    display: "flex",
    alignItems: "center"
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default EventDetailsModal;
