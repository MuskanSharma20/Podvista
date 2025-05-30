import React, { useState } from 'react'
import { GeneratePodcastProps } from '@/types'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'
import { Loader } from 'lucide-react'
import { useAction, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { v4 as uuidv4 } from 'uuid';
import {useUploadFiles} from '@xixixao/uploadstuff/react'
import { useToast } from "@/hooks/use-toast"

//custom hook
const useGeneratePodcast=({
  setAudio, voiceType, voicePrompt, setAudioStorageId
}:GeneratePodcastProps)=>{
//logic for podcast generation
const { toast } = useToast()
const [isGenerating, setIsGenerating] = useState(false);

const getPodcastAudio = useAction(api.aiActions.generateAudioAction)  // change 

const generateUploadUrl=useMutation(api.files.generateUploadUrl)
const { startUpload } = useUploadFiles(generateUploadUrl)

const getAudioUrl=useMutation(api.podcasts.getUrl)



const generatePodcast=async()=>{
  setIsGenerating(true);
  setAudio('');
  if(!voicePrompt){

    toast({
      title: "Please provide a voiceType to generate a podcast",
    })
  
    return setIsGenerating(false);
  }

try {
  const response=await getPodcastAudio({voice:voiceType,input:voicePrompt})
  const blob = new Blob([response], { type: 'audio/mpeg' });
  const fileName = `podcast-${uuidv4()}.mp3`;
  const file = new File([blob], fileName, { type: 'audio/mpeg' });

  const uploaded = await startUpload([file]);
  const storageId = (uploaded[0].response as any).storageId;

  setAudioStorageId(storageId);

  const audioUrl = await getAudioUrl({ storageId });
  setAudio(audioUrl!);
  setIsGenerating(false);

  toast({
    title: "Podcast generated successfully",
  })


} catch (error: any) {
  console.error('Error generating podcast:', error);

  if (error.response) {
    console.error('API Response Error:', error.response.data);
  } else if (error.request) {
    console.error('No Response received:', error.request);
  } else {
    console.error('Error Message:', error.message);
  }

  toast({
    title: "Error creating podcast",
    description: error?.response?.data?.error?.message || error?.message || "Something went wrong!",
      // optional, if you have variants
  });
}
}


  return{isGenerating,generatePodcast
  }
}



const GeneratePodcast = (props:GeneratePodcastProps) => {

  const {isGenerating, generatePodcast} = useGeneratePodcast(props);

  return (
    <div>
      {/* Prompt Text Area */}
    <div className="flex flex-col gap-2.5">
        <Label className="text-16 font-bold text-white-1">
      Transcription
        </Label>
        <Textarea 
          className="input-class font-light focus-visible:ring-offset-orange-1"
          placeholder='Provide text to generate audio'
          rows={5}
          value={props.voicePrompt}
          onChange={(e) => props.setVoicePrompt(e.target.value)}
        />
      </div>

      {/* Generate Button */}
      <div className="mt-5 w-full max-w-[200px]">
      <Button type="submit" className="text-16 bg-orange-1 py-4 font-bold text-white-1" onClick={generatePodcast}>
        {isGenerating ? (
          <>
            Generating
            <Loader size={20} className="animate-spin ml-2" />
          </>
        ) : (
          'Generate'
        )}
      </Button>
      </div>

      {/* audio player if audio exists */}
      {props.audio && (
        <audio 
          controls
          src={props.audio}
          autoPlay
          className="mt-5"
           onLoadedMetadata={(e) => props.setAudioDuration(e.currentTarget.duration)}
        />
      )}
</div>
  )
}

export default GeneratePodcast