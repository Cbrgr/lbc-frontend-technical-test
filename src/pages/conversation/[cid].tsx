import { FC, useEffect, useState } from 'react'
import Head from 'next/head'
import { useParams } from 'react-router-dom';

import Image from 'next/image'
import styles from '../../styles/Conversation.module.css'
import { getLoggedUserId } from '../../utils/getLoggedUserId'
import ConversationsList from '../../components/ConversationsList'
import { useRouter } from 'next/dist/client/router'
import Link from 'next/link';

const Conversation: FC = () => {
	const router = useRouter()
    const convId = router?.query?.cid
    console.log(convId)
    
	const year = new Date().getFullYear()
	const [messages, setMessages] = useState(null)
	const [isMsgLoading, setMsgLoading] = useState(false)
	const [isConvLoading, setConvLoading] = useState(false)
	const [user, setUser] = useState(null)
    const selfId = getLoggedUserId()
    // const userId = (selfId == recipientId) ? senderId : recipientId
    // const userNickname = (selfId == recipientId) ? senderNickname : recipientNickname
    
    useEffect(() => {
		setConvLoading(true)
		fetch('http://localhost:3005/conversations/' + selfId)
		.then((res) => res.json())
		.then((data) => {
            const currentConv = data.filter((c: any) => c.id == convId)[0]
            const userId = (selfId == currentConv.recipientId) ? currentConv.senderId : currentConv.recipientId
            const userNickname = (selfId == currentConv.recipientId) ? currentConv.senderNickname : currentConv.recipientNickname
			setTimeout(() => {
                setUser({'id': userId, 'name': userNickname})
                setConvLoading(false)
			}, 500)
		})
    }, [])

	useEffect(() => {
		setMsgLoading(true)
		fetch('http://localhost:3005/messages/' + convId)
		.then((res) => res.json())
		.then((data) => {
			console.log("RESPONSE")
			console.log(data)
			setTimeout(() => {
                setMessages(data)
				setMsgLoading(false)
			}, 500)
		})
    }, [])
    

	return (
		<div className={styles['conversation']}>
            <div className={styles['conversation__heading']}>
                {isConvLoading ? (
                    <div>loading</div>
                ) : (
                    <div className={styles['conversation__heading-content']}>
                        <Link
                            href={{
                                pathname: '/'
                            }}
                        >
                            <div className={styles['conversation__heading-back']}>❮</div>
                        </Link>
                        
                        <div className={styles['conversation__heading-picture']}>{user?.name.substring(0, 1)}</div>
                        <p className={styles['conversation__heading-name']}>{user?.name}</p>
                    </div>
                )}
            </div>
            <div className={styles['conversation__body']}>
                {isMsgLoading ? (
                    <div>
                        loading
                    </div>
                ) : (
                    <div className={styles['conversation__body-content']}>
                        {messages?.sort((a,b) => {
                            if (a.timestamp < b.timestamp) {
                                return -1
                            } else if (a.timestamp > b.timestamp) {
                                return 1
                            }
                            return 0
                        }).map((message, mIndex) => {

                            return (
                                <div className={`${styles['message']} ${message.authorId == selfId ? styles['message--self'] : styles['message--user']}`}>
                                    {message.authorId != selfId ? (
                                        <p className={styles['message__author']}>
                                            {user.name}
                                        </p>
                                    ) : ''}
                                    
                                    <p className={styles['message__bubble']}>{message?.body}</p>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
            <div className={styles['conversation__footer']}>
                <input type='text' className={styles['conversation__footer-input']} placeholder="Aa" />
		    </div>
		</div>
	)
}

export async function getServerSideProps(context) {
    return {
      props: {},
    };
  }

export default Conversation