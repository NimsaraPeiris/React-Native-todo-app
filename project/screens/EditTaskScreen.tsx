import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import TaskForm from '@/components/TaskForm';
import { Task, Profile } from '@/types/Task';
import { StorageService } from '@/utils/storage';
import { NotificationService } from '@/utils/notifications';
import { Colors } from '@/constants/Colors';
import { GlobalStyles } from '@/constants/Styles';

export default function EditTaskScreen() {
  const router = useRouter();
  const { taskId } = useLocalSearchParams<{ taskId: string }>();
  const [task, setTask] = useState<Task | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    loadTaskAndProfile();
  }, [taskId]);

  const loadTaskAndProfile = async () => {
    try {
      const [tasks, userProfile] = await Promise.all([
        StorageService.getTasks(),
        StorageService.getProfile(),
      ]);

      const foundTask = tasks.find(t => t.id === taskId);
      if (foundTask) {
        setTask(foundTask);
      }
      setProfile(userProfile);
    } catch (error) {
      console.error('Error loading task:', error);
      Alert.alert('Error', 'Failed to load task');
      router.back();
    }
  };

  const handleSave = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!task) return;

    try {
      await StorageService.updateTask(task.id, taskData);
      
      // Reschedule notification if profile exists
      if (profile) {
        const userName = `${profile.firstName} ${profile.lastName}`;
        const updatedTask = { ...task, ...taskData };
        await NotificationService.scheduleTaskNotification(updatedTask, userName);
      }

      Alert.alert(
        'Success',
        'Task updated successfully!',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      console.error('Error updating task:', error);
      Alert.alert('Error', 'Failed to update task. Please try again.');
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (!task) {
    return (
      <SafeAreaView style={[GlobalStyles.container, styles.loadingContainer]}>
        <Text style={styles.loadingText}>Loading task...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={GlobalStyles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Edit Task</Text>
        <Text style={styles.headerSubtitle}>
          Update your task details
        </Text>
      </View>
      
      <TaskForm task={task} onSave={handleSave} onCancel={handleCancel} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.white,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 4,
  },

  headerSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },

  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
});