import { Redirect } from "expo-router";

// Connect Buffer for LazorKit
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import { Buffer } from 'buffer';

global.Buffer = global.Buffer || Buffer;

export default function Index() {
  return <Redirect href="/wallet-init" />;
}
