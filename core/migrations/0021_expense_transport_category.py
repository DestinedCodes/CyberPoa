# Generated manually because Django is not available in the current shell.

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0020_inventory_models'),
    ]

    operations = [
        migrations.AlterField(
            model_name='expense',
            name='category',
            field=models.CharField(
                choices=[
                    ('rent', 'Rent'),
                    ('electricity', 'Electricity'),
                    ('internet', 'Internet'),
                    ('supplies', 'Supplies'),
                    ('maintenance', 'Maintenance'),
                    ('salary', 'Salary'),
                    ('transport', 'Transport'),
                    ('misc', 'Misc'),
                ],
                max_length=20,
                verbose_name='Category',
            ),
        ),
    ]
