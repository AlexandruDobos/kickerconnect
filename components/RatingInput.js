import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const RatingInput = ({ onChange }) => {
    const [selectedRating, setSelectedRating] = useState(1); // Starea pentru nota selectată

    // Funcție pentru gestionarea schimbării notei
    const handleRatingChange = (rating) => {
        setSelectedRating(rating);
        onChange(rating); // Transmite nota selectată către componenta părinte
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Selectează nota:</Text>
            <Picker
                selectedValue={selectedRating}
                style={styles.picker}
                onValueChange={(itemValue) => handleRatingChange(itemValue)}
            >
                {[1, 2, 3, 4, 5].map((number) => (
                    <Picker.Item key={number} label={number.toString()} value={number} />
                ))}
            </Picker>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    label: {
        fontSize: 18,
        marginBottom: 10,
    },
    picker: {
        width: '100%',
        height: 50,
        borderWidth: 1,
        borderColor: 'gray',
    },
});

export default RatingInput;
