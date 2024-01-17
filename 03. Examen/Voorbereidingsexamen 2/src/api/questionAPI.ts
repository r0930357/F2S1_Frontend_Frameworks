import {
    persistToDatabase,
    retrieveFromDatabase,
} from './NIET_OPENEN_WORDT_GEBRUIKT_DOOR_DE_API_FILES/databaseSimulation.ts'
import {IQuestion} from '../models/IQuestion.ts'
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'

//region Mutations & queries

/**
 * ---------------------------------------------------------------------------------------------------------------------
 *                                          MUTATIONS & QUERIES
 * ---------------------------------------------------------------------------------------------------------------------
 */

export const useGetAllQuestionsForSurvey = (surveyId: string) => {
    return useQuery({
        queryKey: ['surveys', surveyId],
        queryFn: () => getAllQuestionsForSurvey({surveyId}),
    })
}

export const useDeleteQuestion = (surveyId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: deleteQuestion,
        onMutate: ({questionId}) => {
            queryClient.setQueryData(['survey', surveyId], o => o.filter(x => x.id !== questionId))
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries(['survey', surveyId])
        }
    })
}

//endregion


//region Fetching functions


/**
 * ---------------------------------------------------------------------------------------------------------------------
 *                                          Fetching functions
 * ---------------------------------------------------------------------------------------------------------------------
 */

interface GetAllQuestionsForSurveyParams {
    surveyId: string
}

/**
 * Haal alle vragen op voor een bepaalde survey.
 *
 * @param surveyId Het id van de survey waarvoor de vragen opgehaald moeten worden
 */
export const getAllQuestionsForSurvey = async ({surveyId}: GetAllQuestionsForSurveyParams): Promise<IQuestion[]> => {
    const allQuestions = await retrieveFromDatabase<IQuestion[]>('_questions', false)
    return allQuestions.filter(q => q.surveyId === surveyId)
}

interface DeleteQuestionsParams {
    questionId: string
}

/**
 * Verwijder de vraag met het opgegeven ID.
 *
 * @param questionId Het id van de vraag die verwijderd moet worden.
 */
export const deleteQuestion = async ({questionId}: DeleteQuestionsParams): Promise<void> => {
    const allQuestions = await retrieveFromDatabase<IQuestion[]>('_questions', false)
    if (!allQuestions) return
    await persistToDatabase('_questions', allQuestions.filter(q => q.id !== questionId), false)
}

//endregion



