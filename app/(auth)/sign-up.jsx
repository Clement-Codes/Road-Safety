import { View, Text, ScrollView, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import { images } from '../../constants';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';
import { Link, router } from 'expo-router';
import { createUser } from '../../lib/appwrite';
import { useGlobalContext } from '../../context/GlobalProvider';

const SignUp = () => {
    const { setUser, setIsLogged } = useGlobalContext();

    const [isSubmitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
      username: "",
      telematicDeviceID:"",
      email: "",
      password: "",
    });
  
    const submit = async () => {
      if (form.username === "" || form.telematicDeviceID === "" || form.email === "" || form.password === "") {
        Alert.alert("Error", "Please fill in all fields");
      }
  
      setSubmitting(true);
      try {
        const result = await createUser(form.email, form.password, form.username, form.telematicDeviceID);
        setUser(result);
        setIsLogged(true);
  
        router.replace("/home");
      } catch (error) {
        Alert.alert("Error", error.message);
      } finally {
        setSubmitting(false);
      }
    };
  

  return (
    <SafeAreaView className="bg-primary h-full">
        <ScrollView className='mb-6'>
            <View className='w-full justify-center h-full px-4 my-6 min-h-[83vh]'>
                <Image source={images.logoNewHor} resizeMode='contain' className="w-[125px] h-[45px]"/>
                <Text className="text-2xl text-white text-semibold mt-10 font-psemibold">Sign up to DriveSafe</Text>
                <FormField title="Username" value={form.username} handleChangeText={(e) => setForm({...form, username: e})} otherStyles="mt-10"/>
                <FormField title="Telematic Device ID" value={form.email} handleChangeText={(e) => setForm({...form, telematicDeviceID: e})} otherStyles="mt-5"/>
                <FormField title="Email" value={form.email} handleChangeText={(e) => setForm({...form, email: e})} otherStyles="mt-5" keyboardType="email-address"/>
                <FormField title="Password" value={form.password} handleChangeText={(e) => setForm({...form, password: e})} otherStyles="mt-5"/>
                <CustomButton title="Sign Up" handlePress={submit} containerStyles="mt-7" isLoading={isSubmitting}/>
                <View className="justify-center pt-5 flex-row gap-2">
                    <Text className="text-lg text-gray-100 font-pregular">
                        Have an account already?{' '}
                        <Link href='/sign-in' className='text-lg font-psemibold text-secondary'>Sign In</Link>
                    </Text>
                </View>
            </View>
        </ScrollView>
    </SafeAreaView>
  )
}

export default SignUp