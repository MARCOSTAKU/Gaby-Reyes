import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PreferencesProvider } from '../context/PreferencesContext';

import AuthNavigator from "./AuthNavigator";

export default function AppNavigator(){

    return(

        <SafeAreaProvider>
            <PreferencesProvider>
                <NavigationContainer>
                    <AuthNavigator/>
                </NavigationContainer>
            </PreferencesProvider>
        </SafeAreaProvider>

    )

}
