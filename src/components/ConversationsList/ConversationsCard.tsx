import type { FC } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import Logo from '../assets/lbc-logo.webp'
import styles from '../../styles/Conversation.module.css'
import { Conversation } from '../../types/conversation'
import { getLoggedUserId } from '../../utils/getLoggedUserId'

const ConversationCard: FC<Conversation> = ({
    id,
    lastMessageTimestamp,
    recipientId,
    recipientNickname,
    senderId,
    senderNickname,
}) => {
    const selfId = getLoggedUserId()
    const userId = (selfId == recipientId) ? senderId : recipientId
    const userNickname = (selfId == recipientId) ? senderNickname : recipientNickname
    return (
        <div className={styles['conversationCard']}>
            <div className={styles['conversationCard__visual']}>{userNickname.substring(0, 1)}</div>
            <div className={styles['conversationCard__content']}>
                <p className={styles['conversationCard__name']}>{userNickname}</p>
                <div className={styles['conversationCard__infos']}>
                    <Link
                        href={{
                            pathname: '/conversation',
                            query: { id: id },
                        }} as={`/conversation/${id}`}
                    >
                        link
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default ConversationCard