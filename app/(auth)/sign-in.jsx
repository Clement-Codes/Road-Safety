import { View, Text, ScrollView, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import { images } from '../../constants';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';
import { Link, router } from 'expo-router';
import { getCurrentUser, signIn } from '../../lib/appwrite';
import { useGlobalContext } from '../../context/GlobalProvider';

const SignIn = () => {

    const { setUser, setIsLoggedIn } = useGlobalContext();
    const [isSubmitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
      email: "",
      password: "",
    });
  
    const submit = async () => {
      if (form.email === "" || form.password === "") {
        Alert.alert("Error", "Please fill in all fields");
      }
  
      setSubmitting(true);
      Alert.alert("Success", form.email + ", " +form.password);
      try {
        await signIn(form.email, form.password);
        const result = await getCurrentUser();
        setUser(result);
        setIsLoggedIn(true);
        Alert.alert("Success", "User signed in successfully");
        router.replace("/home");
      } catch (error) {
        //Alert.alert("Success", form.email + ", " +form.password);
        Alert.alert("Error", error.message);
        const response = JSON.parse(error.response ?? '{}') ?? {};
        Alert.alert(response.message);
        console.log(error)
      } finally {
        setSubmitting(false);
      }
    }
    
  return (
    <SafeAreaView className="bg-primary h-full">
        <ScrollView>
            <View className='w-full justify-center h-full px-4 my-6 min-h-[83vh]'>
                <Image source={images.logoNewHor} resizeMode='contain' className="w-[125px] h-[45px]"/> 
                {/* <Image source={images.logo} resizeMode='contain' className="w-[115px] h-[35px]"/> */}
                <Text className="text-2xl text-white text-semibold mt-10 font-psemibold">Log in to DriveSafe</Text>
                <FormField title="Email" value={form.email} handleChangeText={(e) => setForm({...form, email: e})} otherStyles="mt-5" keyboardType="email-address"/>
                <FormField title="Password" value={form.password} handleChangeText={(e) => setForm({...form, password: e})} otherStyles="mt-5"/>
                <CustomButton title="Sign In" handlePress={submit} containerStyles="mt-7" isLoading={isSubmitting}/>
                <View className="justify-center pt-5 flex-row gap-2">
                    <Text className="text-lg text-gray-100 font-pregular">
                        Don't have account?{' '}
                        <Link href='/sign-up' className='text-lg font-psemibold text-secondary'>Sign Up</Link>
                    </Text>
                </View>
            </View>
        </ScrollView>
    </SafeAreaView>
  )
}

export default SignIn