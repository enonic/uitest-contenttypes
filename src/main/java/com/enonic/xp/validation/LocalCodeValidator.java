package com.enonic.xp.validation;


import org.osgi.service.component.annotations.Component;

import com.enonic.xp.app.ApplicationKey;
import com.enonic.xp.content.ContentValidator;
import com.enonic.xp.content.ContentValidatorParams;
import com.enonic.xp.content.ValidationError;
import com.enonic.xp.content.ValidationErrorCode;
import com.enonic.xp.content.ValidationErrors;
import com.enonic.xp.data.PropertyPath;
import com.enonic.xp.schema.content.ContentTypeName;

@Component
public class LocalCodeValidator
    implements ContentValidator
{
    private static final ApplicationKey APP_KEY = ApplicationKey.from( "com.enonic.xp.ui_testing.contenttypes" );

    private static final ContentTypeName SUPPORTED_TYPE = ContentTypeName.from( APP_KEY, "localecode" );

    @Override
    public boolean supports( ContentTypeName contentType )
    {
        return contentType.equals( SUPPORTED_TYPE );
    }

    @Override
    public void validate( ContentValidatorParams params, ValidationErrors.Builder builder )
    {
        String text = params.getData().getString( "localeCode" );
        if ( text != null && text.startsWith( "en-US" ) )
        {
            builder.add(
                ValidationError.dataError( ValidationErrorCode.from( APP_KEY, "my_custom_error_code" ), PropertyPath.from( "localeCode" ) )
                    .message( "Invalid value entered" )
                    .build() );
        }
        String text2 = params.getData().getString( "localeCode2" );
        if ( text2 != null && text2.startsWith( "ar-EG" ) )
        {
            builder.add(
                ValidationError.dataError( ValidationErrorCode.from( APP_KEY, "my_custom_error_code" ), PropertyPath.from( "localeCode2" ) )
                    .message( "Invalid value selected" )
                    .build() );
        }
    }
}
