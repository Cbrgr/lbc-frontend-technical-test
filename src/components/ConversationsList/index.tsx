import { FC, useEffect, useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import Logo from '../assets/lbc-logo.webp'
import styles from '../../styles/ConversationList.module.css'
import { Conversation } from '../../types/conversation'
import { getLoggedUserId } from '../../utils/getLoggedUserId'
import ConversationCard from './ConversationsCard'

const ConversationsList: FC = () => {

    const year = new Date().getFullYear()
	const [conversations, setConversations] = useState(null)
	const [isLoading, setLoading] = useState(false)
	const userId = getLoggedUserId()
	
	useEffect(() => {
		setLoading(true)
		fetch('http://localhost:3005/conversations/' + userId)
		.then((res) => res.json())
		.then((data) => {
			console.log("RESPONSE")
			console.log(data)
			setTimeout(() => {
				setConversations(data)
				setLoading(false)
			}, 500)
		})
    }, [])
    
    return (
        <div className={styles['conversationList']}>
            {isLoading ? (
                <div>
                    loading
                </div>
            ) : (
                <div>
                    {conversations?.map((conv, cIndex) => {

                        return (
                            <ConversationCard {...conv} />
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default ConversationsList