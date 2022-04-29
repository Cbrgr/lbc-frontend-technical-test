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
            setConversations(data)
            setLoading(false)
		})
    }, [])
    
    return (
        <div className={styles['conversationList']}>
            <div className={styles['conversationList__heading']}>
                Discussions
            </div>
            <div className={styles['conversationList__body']}>
                {isLoading ? (
                    <div className="loader">loading</div>
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
            
        </div>
    )
}

export default ConversationsList