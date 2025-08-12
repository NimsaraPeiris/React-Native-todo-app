import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import TaskForm from '@/components/TaskForm';
import { Task, Profile } from '@/types/Task';
import { StorageService } from '@/utils/storage';
import { NotificationService } from '@/utils/notifications';
import { Colors } from '@/constants/Colors';
import { GlobalStyles } from '@/constants/Styles';

export default function AddTaskScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const userProfile = await StorageService.getProfile();
      setProfile(userProfile);
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleSave = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newTask = await StorageService.addTask(taskData);
      
      // Schedule notification if profile exists
      if (profile) {
        const userName = `${profile.firstName} ${profile.lastName}`;
        await NotificationService.scheduleTaskNotification(newTask, userName);
      }

      Alert.alert(
        'Success',
        'Task added successfully!',
        [
          {
            text: 'OK',
            onPress: () => {
              router.replace('/(tabs)');
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error saving task:', error);
      Alert.alert('Error', 'Failed to save task. Please try again.');
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <SafeAreaView style={GlobalStyles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleCancel}>
          <ArrowLeft size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Task</Text>
        <Text style={styles.headerSubtitle}>
          Create a new task to stay organized
        </Text>
      </View>
      
      <TaskForm onSave={handleSave} onCancel={handleCancel} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.white,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
    position: 'relative',
  },

  backButton: {
    position: 'absolute',
    left: 16,
    top: 16,
    zIndex: 1,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 4,
    textAlign: 'center',
  },

  headerSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});