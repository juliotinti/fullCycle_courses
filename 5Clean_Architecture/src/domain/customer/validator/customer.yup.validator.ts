import ValidatorInterface from '../../@shared/validator/validator.interface';
import Customer from '../entity/customer';
import * as yup from 'yup';

export default class CustomerYupValidator
    implements ValidatorInterface<Customer>
{
    validate(entity: Customer): void {
        try {
            yup.object()
                .shape({
                    name: yup.string().required('Name is required'),
                    id: yup.string().required('Id is required'),
                })
                .validateSync(
                    {
                        name: entity.name,
                        id: entity.id,
                    },
                    {
                        abortEarly: false,
                    }
                );
        } catch (errors) {
            const e = errors as yup.ValidationError;
            e.errors.forEach((error) => {
                entity.notification.addError({
                    context: 'customer',
                    message: error,
                });
            });
        }
    }
}
