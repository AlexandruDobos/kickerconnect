import React from 'react';
import { Platform, View, TextInput, TouchableOpacity, StyleSheet, Text } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';

const DateInput = ({ value, onChange }) => {
    const [showDatePicker, setShowDatePicker] = React.useState(false);

    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            const currentDate = selectedDate.toISOString().split('T')[0]; // format YYYY-MM-DD
            onChange(currentDate);
        }
    };

    if (Platform.OS === 'web') {
        return (
            <TextInput
                style={styles.input}
                type="date"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        );
    }

    return (
        <View>
            <TouchableOpacity style={styles.dateInput} onPress={() => setShowDatePicker(true)}>
                <Text style={styles.dateText}>{value}</Text>
                <Ionicons name="calendar-outline" size={24} color="black" />
            </TouchableOpacity>
            {showDatePicker && (
                <View style={styles.pickDate}>
                <DateTimePicker
                    value={new Date(value || Date.now())}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                    
                />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    dateInput: {
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
    },
    dateText: {
        fontSize: 16,
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
        flex: 1,
        marginRight: 10,
    },
    pickDate:{
        
        display: "flex",
        justifyContent: "center",
    }
});

export default DateInput;
