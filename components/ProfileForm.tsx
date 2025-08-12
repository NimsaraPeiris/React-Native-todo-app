import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { User, Camera, Save, ArrowLeft } from 'lucide-react-native';
import { Profile } from '@/types/Task';
import { Colors } from '@/constants/Colors';
import { GlobalStyles } from '@/constants/Styles';

interface ProfileFormProps {
  profile: Profile | null;
  onSave: (profile: Profile) => void;
  onCancel?: () => void;
}

export default function ProfileForm({ profile, onSave, onCancel }: ProfileFormProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [firstNameFocused, setFirstNameFocused] = useState(false);
  const [lastNameFocused, setLastNameFocused] = useState(false);
  const [imageUrlFocused, setImageUrlFocused] = useState(false);

  useEffect(() => {
    if (profile) {
      setFirstName(profile.firstName);
      setLastName(profile.lastName);
      setImageUrl(profile.imageUrl);
    }
  }, [profile]);

  const handleSave = () => {
    if (!firstName.trim() || !lastName.trim()) {
      Alert.alert('Error', 'Please enter both first and last name');
      return;
    }

    const profileData: Profile = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      imageUrl: imageUrl.trim(),
    };

    onSave(profileData);
  };

  const defaultImageUrl = 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=400';

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {onCancel && (
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onCancel}>
            <ArrowLeft size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.form}>
        <Text style={styles.formTitle}>Profile Information</Text>

        <View style={styles.imageContainer}>
          <View style={styles.imageWrapper}>
            <Image
              source={{ uri: imageUrl || defaultImageUrl }}
              style={styles.profileImage}
              defaultSource={{ uri: defaultImageUrl }}
            />
            <View style={styles.imageOverlay}>
              <Camera size={24} color={Colors.white} />
            </View>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={GlobalStyles.label}>First Name *</Text>
          <TextInput
            style={[
              GlobalStyles.input,
              firstNameFocused && GlobalStyles.inputFocused,
            ]}
            value={firstName}
            onChangeText={setFirstName}
            placeholder="Enter your first name"
            onFocus={() => setFirstNameFocused(true)}
            onBlur={() => setFirstNameFocused(false)}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={GlobalStyles.label}>Last Name *</Text>
          <TextInput
            style={[
              GlobalStyles.input,
              lastNameFocused && GlobalStyles.inputFocused,
            ]}
            value={lastName}
            onChangeText={setLastName}
            placeholder="Enter your last name"
            onFocus={() => setLastNameFocused(true)}
            onBlur={() => setLastNameFocused(false)}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={GlobalStyles.label}>Profile Image URL</Text>
          <TextInput
            style={[
              GlobalStyles.input,
              imageUrlFocused && GlobalStyles.inputFocused,
            ]}
            value={imageUrl}
            onChangeText={setImageUrl}
            placeholder="Enter image URL (optional)"
            onFocus={() => setImageUrlFocused(true)}
            onBlur={() => setImageUrlFocused(false)}
            autoCapitalize="none"
            keyboardType="url"
          />
        </View>

        <TouchableOpacity style={GlobalStyles.button} onPress={handleSave}>
          <View style={styles.saveButtonContent}>
            <Save size={18} color={Colors.white} />
            <Text style={GlobalStyles.buttonText}>Save Profile</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  header: {
    padding: 16,
    paddingBottom: 0,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },

  form: {
    padding: 16,
  },

  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 24,
    textAlign: 'center',
  },

  imageContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },

  imageWrapper: {
    position: 'relative',
  },

  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.gray200,
  },

  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.white,
  },

  inputGroup: {
    marginBottom: 16,
  },

  saveButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});