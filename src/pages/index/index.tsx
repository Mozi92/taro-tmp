import {View, Text} from '@tarojs/components'
import './index.scss'
import $http from "../../utils/my.axios";
import "../../configs/axios.config";

export default function Index() {
  let $ = new $http();
  console.log($.get({url: 'yqOpinion/hot/factor', data: {}}))
  return (
    <View className='container'>
      <Text>intro</Text>
    </View>
  )
}
