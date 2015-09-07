class ApplicationController < ActionController::Base
  
  protect_from_forgery with: :exception
  after_filter :set_csrf_cookie_for_ng
  respond_to :json
  
  
  def set_csrf_cookie_for_ng     
    cookies['XSRF-TOKEN'] = form_authenticity_token if protect_against_forgery? 
  end  
  
  rescue_from CanCan::AccessDenied do |exception|
    render :file => "#{Rails.root}/app/assets/templates/403.html", :status => 403, :layout => false
  end

  rescue_from ActionController::InvalidAuthenticityToken do |exception|     
    set_csrf_cookie_for_ng
    message = 'Rails CSRF token error, please try again'     
    render_with_protection(message.to_json, {:status => :unprocessable_entity}) 
  end
    
  def render_with_protection(object, parameters = {})
    render parameters.merge(content_type: 'application/json', text: ")]}',\n" + object.to_json)
  end

  protected

  def verified_request?
    super || valid_authenticity_token?(session, request.headers['X-XSRF-TOKEN'])
  end

end
